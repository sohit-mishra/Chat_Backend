const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "_id name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 }); 

    const users = conversations
      .map((conv) => {
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== userId
        );

        if (!otherUser) return null;

        return {
          conversationId: conv._id,
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          lastMessage: conv.lastMessage?.text || "",
          timestamp: conv.lastMessage?.createdAt || conv.updatedAt,
          unreadCount: conv.lastMessage
            ? conv.lastMessage.readBy?.includes(userId)
              ? 0
              : 1
            : 0,
        };
      })
      .filter(Boolean);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};





const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;   
    const userId = req.user.id;   

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: id },
        { sender: id, receiver: userId }
      ]
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
}

const createConversation = async (req, res) => {
  try {
    const { to } = req.body; 
    const userId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, to] },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    conversation = await Conversation.create({
      participants: [userId, to],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation", error: error.message });
  }
};

const conversationController = {
  getUserConversations,
  getConversationMessages,
  createConversation,
};

module.exports = conversationController;
