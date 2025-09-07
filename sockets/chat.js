const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const env = require("../config/env");

const onlineUsers = new Map();

function setupChatSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    io.emit("users:online", Array.from(onlineUsers.keys()));


    socket.on("typing:start", ({ to }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit("typing:start", { from: socket.userId });
      }
    });

    socket.on("typing:stop", ({ to }) => {
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit("typing:stop", { from: socket.userId });
      }
    });


    socket.on("message:send", async ({ to, text }) => {
      try {
        let conversation = await Conversation.findOne({
          participants: { $all: [socket.userId, to] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [socket.userId, to],
          });
        }

        const message = await Message.create({
          conversation: conversation._id,
          sender: socket.userId,
          receiver: to,
          text,
          delivered: onlineUsers.has(to),
        });

        conversation.lastMessage = message._id;
        conversation.updatedAt = Date.now();
        await conversation.save();

        if (onlineUsers.has(to)) {
          io.to(onlineUsers.get(to)).emit("message:new", message);
        }
        io.to(socket.id).emit("message:new", message);
      } catch (err) {
        console.error("message:send error", err);
      }
    });

    socket.on("message:read", async ({ messageId }) => {
      try {
        const msg = await Message.findByIdAndUpdate(
          messageId,
          { read: true },
          { new: true }
        );

        if (msg && onlineUsers.has(msg.sender.toString())) {
          io.to(onlineUsers.get(msg.sender.toString())).emit("message:read", {
            messageId: msg._id,
          });
        }
      } catch (err) {
        console.error("message:read error", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });
  });
}

module.exports = { setupChatSockets };
