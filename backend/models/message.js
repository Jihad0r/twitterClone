import mongoose from "mongoose";

export const messageSchems = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    resiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
},
{ timestamps: true })

const Message = mongoose.model("Message",messageSchems)

export default Message;