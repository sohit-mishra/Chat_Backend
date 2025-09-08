const User = require("../models/User");
const ImageKit = require("imagekit");
const env = require("../config/env");
const Conversation = require("../models/Conversation");

const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
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

    const conversations = await Conversation.find({
      participants: userId,
    });

    const conversationUserIds = new Set();
    conversations.forEach((conv) => {
      conv.participants.forEach((p) => {
        if (p.toString() !== userId) conversationUserIds.add(p.toString());
      });
    });

    const users = await User.find({
      _id: { $nin: [...conversationUserIds, userId] },
    }).select("_id name avatar");

    res.status(200).json(users);
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
    ).select(
      "-password -otp -resetToken -isVerified  -createdAt -updatedAt -resetTokenExpiry"
    );

    if (!updateData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Upload successful",
      updateData,
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
