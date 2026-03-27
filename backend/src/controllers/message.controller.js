import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserIUd = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserIUd },
    }).select("-password");
    res.status(200).json({
      users: filteredUsers,
    });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages controller :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverID } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId: receiverID,
      text,
      image: imageUrl,
    });
    res.status(200).json({
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};
