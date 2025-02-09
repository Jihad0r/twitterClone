import mongoose from "mongoose";

export const userSchems = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
    },password:{
        type:String,
        required:true,
        minLingth:8,
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    followers :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],following :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    profileImg:{
        type:String,
        default:"",
    },
    coverImg:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    },
    likePosts:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }]
},
{ timestamps: true })

const User = mongoose.model("User",userSchems)

export default User;