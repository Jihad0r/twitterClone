import Conversation from "../models/conversation.js"
import Message from "../models/message.js"
import User from "../models/user.js";
import { getReceiverSocketId,io } from "../socket.js"

export const userChats = async(req,res)=>{
    try {
        const logeduser = req.user._id
        const users = await User.find({
            _id: { $ne: logeduser}
        }).select("-password");
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
  }
export const getMessage = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants:{$all: [senderId,userToChatId]},
        }).populate("messages")

        if(!conversation){
            return res.status(200).json([])
        }
        const message = conversation.messages
        res.status(200).json(message)
    } catch (error) {
        res.status(500).json(error.message)
        
    }
  }
  
export const sendMessage = async(req,res)=>{
    try {
        const {id:resiverId} = req.params
        const {message} = req.body
        const senderId = req.user._id
    
            let conversation = await Conversation.findOne({
            participants:{$all: [senderId,resiverId]},
        })  
        if(!conversation){
                conversation = await Conversation.create({
                participants:[senderId,resiverId],
            })
            }
            const newMessage = new Message({
                senderId,
            resiverId,
            message
        })
    
        if(newMessage){
            conversation.messages.push(newMessage._id)
            }
        await Promise.all([conversation.save(),newMessage.save()])
        const receiverId = getReceiverSocketId(resiverId)
        if(receiverId){
            io.to(receiverId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json(error.message)
    }
}