import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
        },
        img: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true } // This adds createdAt and updatedAt to each comment
);

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
    comments: [commentSchema],
},
{ timestamps: true })

const Post = mongoose.model("Post",postSchems)

export default Post;