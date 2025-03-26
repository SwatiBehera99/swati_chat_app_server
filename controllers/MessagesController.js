import Message from "../model/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("Both user IDs are required.");
    }
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (err) {
    return response.status(500).json({ message: error.message });
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    if (request.file) {
      const date = Date.now();
      let fileDir = `uploads/files/${date}`;
      let fileName = `${fileDir}/${request.file.originalname}`;
      mkdirSync(fileDir, { recursive: true });
      renameSync(request.file.path, fileName);
      return response.status(200).json({ filePath: fileName });
    } else {
      return response.status(404).send("File is required.");
    }
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};
