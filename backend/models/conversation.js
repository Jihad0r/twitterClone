import mongoose from "mongoose";

export const conversationSchems = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
        default:[]
    },],
},
{ timestamps: true })

const Conversation = mongoose.model("Conversation",conversationSchems)

export default Conversation;