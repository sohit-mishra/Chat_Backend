const User = require("../models/User");
const ImageKit = require("imagekit");
const env = require("../config/env");
const Message = require('../models/Message');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "-password -otp -resetToken -resetTokenExpiry"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const send = {
      name: user.name,
      _id: user._id,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };

    res.status(200).json(send);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await User.find({ _id: { $ne: userId } }).select(
      "_id name avatar"
    );

    const usersWithMessages = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: user._id },
            { sender: user._id, receiver: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: userId,
          read: false,
        });

        return {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          lastMessage: lastMessage ? lastMessage.text : "Start Chatting",
          timestamp: lastMessage ? lastMessage.createdAt : null,
          unreadCount,
        };
      })
    );

    res.status(200).json(usersWithMessages);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
     const userId = req.user.id;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}_${req.file.originalname}`,
      folder: "/uploads",
    });

    const updateData = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.url },
      { new: true }
    ).select("-password -otp -resetToken -isVerified  -createdAt -updatedAt -resetTokenExpiry");

    if (!updateData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Upload successful",
      updateData
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const getUserByUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true }
    ).select(
      "-password -otp -resetToken -resetTokenExpiry -isVerified -createdAt -updatedAt"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

const userController = {
  getMyProfile,
  getAllUsers,
  updateProfilePhoto,
  getUserByUpdate,
};

module.exports = userController;
