import { generateTokensAndSetCookie } from "../lib/utils/generateToken.js"
import User from "../models/user.js"
import bcrypt from "bcryptjs"
export const signup = async (req,res)=>{
    try{
        const {username,fullname,email,password} = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}  
        const isUserExist = await User.findOne({username})
        if(isUserExist){
            return res.status(400).json({error:"user is already exist"})
        }
        const isEmailExist = await User.findOne({email})
        if(isEmailExist){
            return res.status(400).json({error:"email is already exist"})
        }
        if(password.length < 10){
            return res.status(400).json({error:"password must be more then 10"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            username,
            fullname,
            email, 
            password:hashPassword
        })

        if(newUser){
            generateTokensAndSetCookie(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                username:newUser.username,
                fullname:newUser.fullname,
                email:newUser.email, 
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,
                bio:newUser.bio,
                link:newUser.link,
            })
        }else{
            res.status(400).json({error:"invalid user data"})
        }
    }catch(error){
        res.status(501).json({error:"interval server error"})
    }
}
export const login = async(req,res)=>{
    try{
        const {username,password} = req.body

        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"password is wrong"})
        }
            generateTokensAndSetCookie(user._id,res)

            res.status(201).json({
                _id:user._id,
                username:user.username,
                fullname:user.fullname,
                email:user.email,
                followers:user.followers,
                following:user.following,
                profileImg:user.profileImg,
                coverImg:user.coverImg,
            })
            
    }catch(error){
        res.status(500).json({error:"interval server error"})
    }
}
export const logout= async(req,res)=>{
    try{
       res.cookie("jwt","",{maxAge:0})
        res.status(200).json({massage:"loged out success"})
    }catch(error){
        res.status(500).json({error:"interval server error"})
    }
}
export const myaccount = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({error:"interval server error"})
    }
}