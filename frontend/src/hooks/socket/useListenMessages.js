import { useEffect } from "react";
import useConversation from "../../hooks/getconv";
import { useSocket } from "../../hooks/socket/useSocket";
const useListenMessages = () => {
	const { socket } = useSocket();
	const { messages, setMessages } = useConversation();
	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;