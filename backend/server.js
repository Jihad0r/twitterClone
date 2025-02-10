// import express from "express"
// import path from "path"
// import authRoutes from "./routes/auth.js"
// import userRoutes from "./routes/user.js"
// import postRoutes from "./routes/post.js"
// import notificationRoutes from "./routes/notification.js"
// import chatRoutes from "./routes/chat.js"
// import dotenv from "dotenv"
// import { connectDB } from "./db/connectDB.js"
// import {v2 as cloudinary} from "cloudinary"
// import { app, server } from "./socket.js"
// import cookieParser from "cookie-parser"

// dotenv.config()

// const __dirname = path.resolve();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_Key,
//     api_secret: process.env.CLOUDINARY_API_Secret,
// })

// const port = process.env.PORT||5000
// app.use(express.json({limit:"5mb"}))

// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser())
// app.use("/api/auth",authRoutes)
// app.use("/api/users",userRoutes)
// app.use("/api/posts",postRoutes)
// app.use("/api/notifications",notificationRoutes)
// app.use("/api/chats",chatRoutes)

// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});

// server.listen(port,()=>{
//     console.log("Server running")
//     connectDB()
// })
// "scripts": {
//   "server": "NODE_ENV=development nodemon backend/server.js",
//   "start": "NODE_ENV=production node backend/server.js",
//   "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
// },
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import notificationRoutes from "./routes/notification.js";
import chatRoutes from "./routes/chat.js";
import { connectDB } from "./db/connectDB.js";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_Key,
  api_secret: process.env.CLOUDINARY_API_Secret,
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

connectDB();
// Export app for Vercel
export default app;
