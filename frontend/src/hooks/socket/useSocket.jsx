import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import io from 'socket.io-client'
const SocketContext = createContext()

export const useSocket  = ()=>{return useContext(SocketContext)}

export const SocketContextProvider = ({children}) =>{
    const [socket,setSocket] = useState(null)
    const [onlineUser,setOnlineUser] = useState([])
    const {data:authUser} = useQuery({queryKey:["authUser"]})
    useEffect(()=>{
        if(authUser){
            const socket =io("http://localhost:5000",{
                query:{
                    userId:authUser._id
                }
            })
            setSocket(socket)
            socket.on("getOnlineUsers",(users)=>{setOnlineUser(users)})
            return ()=> socket.close() 
        }else{
            if(socket){
                socket.close()
                setSocket(null)
            }
        }
    },[authUser])
    return(
        <SocketContext.Provider value={{onlineUser,socket}}>
            {children}
        </SocketContext.Provider>
    )
}