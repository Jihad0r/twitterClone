import mongoose from "mongoose";

export const postSchems = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    },
    img:{
        type:String,
    },
    likes :[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
    comments:[{
        text: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    }],
},
{ timestamps: true })

const Post = mongoose.model("Post",postSchems)

export default Post;