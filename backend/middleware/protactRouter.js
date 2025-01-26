import User from "../models/user.js";
import jwt from "jsonwebtoken"

export const protactRouter = async (req,res,next)=>{
    try{
        const token = await req.cookies.jwt
        if(!token){
            return res.status(401).json({error:"unauthorized: no token provieder there"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decoded){
            return res.status(401).json({error:"unauthorized: no token provieder here"})
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        req.user = user;
        next()
    }catch(error){
        console.log(error.message)
        res.status(500).json({error:"interval server error"})
    }
}
