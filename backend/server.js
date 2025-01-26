import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"
import notificationRoutes from "./routes/notification.js"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY ,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const app = express()
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true})) //postman form-urlencoded
app.use(cookieParser()) // to get coockies
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)

app.listen(5000,()=>{
    console.log("Server running")
    connectDB()
})