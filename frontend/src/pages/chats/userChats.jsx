import { Link } from "react-router-dom";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";
import { BsFillChatLeftFill } from "react-icons/bs";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useConversation from "../../hooks/getconv";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/socket/useSocket";


export const UserChats = () => {
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
	if(Chats?.length === 0)return <div className="md:w-64 w-0"></div> 
	return (
		<div className="flex my-4 mx-2 hidden lg:block">
            <div className="bg-[#16181C] p-4 flex flex-col sm:h-[350px] md:h-[250px] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg">
				<p className='font-bold'>Chats</p>
				<div className='flex flex-col gap-4 p-1 overflow-x-hidden overflow-y-auto'> 
					{loading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!loading &&
						Chats?.map((user) => (
							<Link to={`/chats/${user._id}`}>
							<div className={`flex items-center justify-between gap-4 p-2 rounded-lg ${(selectedConversation?._id === user._id)?" bg-[#01496a]":""}`}
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
	);
}
