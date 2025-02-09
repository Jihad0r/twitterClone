import { useEffect, useRef, useState } from "react";
import useConversation from "../../hooks/getconv";
import { BsSend } from "react-icons/bs";
import useSendMessage from "./sendMessage";
import { extractTime } from "../../hooks/extractTime.js";
import MessageSkeleton from "../../components/skeletons/MessageSkeleton.jsx";
import useGetMessages from "../../hooks/useGetMessages.js";
import useListenMessages from "../../hooks/socket/useListenMessages.js";

export const Messages = ({authUser}) => {
    const [message, setMessage] = useState("");
    const { sendMessage, loading: pending } = useSendMessage();
    const { selectedConversation } = useConversation();
    
    const { messages, loading } = useGetMessages()
    useListenMessages()
    const lastMsg = useRef()
    console.log(messages?.filter((msg)=>(msg.senderId ===selectedConversation?._id)))
    console.log(messages?.map((msg)=>(msg.message)))
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    };
    useEffect(()=>{
        setTimeout(()=>{
            lastMsg.current?.scrollIntoView({behavior:"smooth"})
        },100)
    },[messages])
    console.log(selectedConversation)
	return (
        <div className="flex-[4_4_0] border-r border-gray-700">
            <div className="flex flex-col sm:h-[650px] md:h-[650px] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg">
                        <p className="p-4 bg-[#16181C]">To: {selectedConversation?.fullname}</p>
                        <div className="p-4 flex-1 overflow-auto">
                        {loading && <MessageSkeleton />}
                        {!loading &&  messages?.length === 0 && <p>No messages yet. Start the conversation!</p>}
                        {!loading && messages?.length > 0 && messages?.filter((msg)=>(msg.senderId ===selectedConversation?._id ||msg.resiverId ===selectedConversation?._id)).map((msg) => (
                                    <div
                                        key={msg._id}
                                        ref={lastMsg}
                                        className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                                    >
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                <img
                                                    alt="Profile"
                                                    src={
                                                        msg.senderId === authUser._id
                                                            ? authUser.profileImg
                                                            : selectedConversation?.profileImg
                                                    }
                                                />
					                        </div>
		                                </div>
                                        <div className="chat-header">
                                            {msg.senderId === authUser._id
                                                ? authUser.username
                                                : selectedConversation?.username}
                                        </div>
                                        <div
                                            className={`chat-bubble rounded-full ${
                                                msg.senderId === authUser._id ? "bg-blue-500" : "bg-gray-600"
                                            }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <div className="chat-footer"><p className="text-xs opacity-50">{extractTime(msg.createdAt)}</p></div>
                                    </div>
                                ))
                            }
                        </div> 
                        <form className="px-4 my-3" onSubmit={handleSubmit}>
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
                                    placeholder="Send a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                                    aria-label="Send message"
                                >
                                    {pending ? <div className="loading loading-spinner"></div> : <BsSend />}
                                </button>
                            </div>
                        </form>
            </div>
        </div>);
};