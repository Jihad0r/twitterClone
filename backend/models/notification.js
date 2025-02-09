import mongoose from "mongoose";


const notificationSchems = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]
    },
    type:{
        type:String,
        required:true,
        enum:["follow","like","comment"]
    },
    read:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true })

const Notification = mongoose.model("notification",notificationSchems)

export default Notification;