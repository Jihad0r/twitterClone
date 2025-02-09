import { Link } from "react-router-dom";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";
import { BsFillChatLeftFill } from "react-icons/bs";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useConversation from "../../hooks/getconv";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/socket/useSocket";



	
export const PhoneChat = () => {
    const [loading, setLoading] = useState(false);
	const [Chats, setChats] = useState([]);
	const {selectedConversation,setSelectedConversation}  = useConversation()
    const {onlineUser}=useSocket()
	useEffect(() => {
		const getChats = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/chats");
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setChats(data);
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		getChats();
	}, []);
	useEffect(()=>{()=> setSelectedConversation(null)},[selectedConversation])
  return (<div className="flex-[4_4_0] mr-auto  border-r border-gray-700 min-h-screen">
    <div className=" flex flex-col rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg">
        <p className='font-bold bg-[#16181C] p-4'>Chats</p>
        <div className='flex flex-col gap-4 pt-6 pr-6 pl-6'> 
            {loading && (
                <div className='flex flex-col gap-4 w-full'>
                {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className='flex items-center justify-between gap-4 bg-[#16181C] p-2 rounded-lg'>
                        <div className='flex gap-4 items-center'>
                            <div className='skeleton w-10 h-10 rounded-full shrink-0'></div>
                            <div className='flex flex-col gap-2'>
                                <div className='skeleton h-3 w-24 rounded-full'></div>
                                <div className='skeleton h-3 w-32 rounded-full'></div>
                            </div>
                        </div>
                        <div className='skeleton w-20 h-8 rounded-full'></div>
                    </div>
                ))}
            </div>
            )}
            {!loading &&
                Chats?.map((user) => (
                    <Link to={`/chats/${user._id}`} className="bg-[#16181C] p-2  rounded-lg ">
                    <div className={`flex items-center justify-between gap-4  ${(selectedConversation?._id === user._id)?" bg-[#01496a]":""}`}
                    key={user._id}
                    onClick={()=> setSelectedConversation(user)}>
                        <div className='flex gap-2 items-center'>
                            <div className={`avatar ${onlineUser.includes(user._id)?"online":""} `}>
                                <div className='w-8 rounded-full'>
                                    <img src={user.profileImg || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <span className='font-semibold tracking-tight truncate w-28'>
                                    {user.fullname}
                                </span>
                            </div>
                        </div>
                        <div>
                                {loading? <LoadingSpinner size="sm"/>:<BsFillChatLeftFill className='w-6 h-6'  /> }
                        </div>
                    </div>
                    </Link>
                ))}
        </div>
    </div>
</div>
  )
}
