import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { formatPostDate } from "../../utils/data";

const NotificationPage = () => {
	const queryClient = useQueryClient()
	const {
		data:notifications
	} = useQuery({ 
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/notifications/`)
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;

			} catch (error) {
				throw new Error(error);
			}
		}
	})
	const {mutate:deleteNotifications,isLoading} = useMutation({
		mutationFn:async()=>{
			try {
				const res = await fetch(`/api/notifications/delete`,{
					method:"DELETE"
				})
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
				
			} catch (error) {
				throw new Error(error);	
			}
		},	
		onSuccess:async()=>{
			queryClient.invalidateQueries({queryKey:["posts"]})
			queryClient.invalidateQueries({queryKey:["notifications"]})
		}
	})
	const { mutate: markAsRead } = useMutation({
		mutationFn: async (notificationId) => {
		  const res = await fetch(`/api/notifications/${notificationId}`, {
			method: "PUT",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ read: true }),
		  });
	  
		  if (!res.ok) {
			throw new Error("Failed to update notification.");
		  }
		  
		  return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey:["notifications"]})
		},
		onError: (error) => {
		  console.error("Error updating notification:", error);
		}
	  });
	  
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' >
						<Link to={`/post/${notification.post}`}>
						<div className='flex gap-2 p-4 relative w-full' onClick={() => markAsRead(notification._id)} key={notification._id}>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							{notification.type === "comment" && <FaComment className='w-7 h-7 text-blue-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
							</Link>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" && "followed you"}
									{notification.type === "comment" && "comment on your post"}
									{notification.type === "like" && "liked your post"}
								</div>

							
							<span className="absolute top-2 right-5">{formatPostDate(notification.createdAt)}</span>
						</div>
						</Link>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;