import { useEffect, useState } from "react";
import useConversation from "./getconv";
import { useParams } from "react-router-dom";


const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/chats/${selectedConversation?._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	},[selectedConversation._id,setMessages]);

	return { messages, loading };
};
export default useGetMessages;