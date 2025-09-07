const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id; 

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params; 

    const messages = await Message.find({ conversation: id })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

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
