import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Both senderId and receiverId are required' });
  }
  const newChat = new ChatModel({
    members: [senderId, receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await ChatModel.find({
      members: { $elemMatch: { $eq: userId } },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};