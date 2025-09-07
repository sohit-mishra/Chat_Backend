const User = require("../models/User");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password -otp -resetToken -resetTokenExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await User.find({ _id: { $ne: userId } }).select("name email avatar");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("name email avatar");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    delete updates.password;
    delete updates.resetToken;
    delete updates.resetTokenExpiry;
    delete updates.otp;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password -otp -resetToken -resetTokenExpiry");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

const userController = {
  getMyProfile,
  getAllUsers,
  getUserById,
  updateProfile,
};

module.exports = userController;
