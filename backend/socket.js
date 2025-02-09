import { Server } from "socket.io";
import http from "http"
import express from "express"


const app = express()

const server = http.createServer(app)

const userSocketMap = {}
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5001"],
        methods:["GET","POST"]
    }
})
export const getReceiverSocketId = (resiverId)=>{
    return userSocketMap[resiverId]
} 
io.on('connection',(socket)=>{
    console.log("a user connect",socket.id)
    const userId = socket.handshake.query.userId
    if(userId != "undefined") userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        console.log("a user disconnected",socket.id)
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    })
})

export {app,io,server}