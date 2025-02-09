import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow  from "../../hooks/useFollow";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

	
export const PhoneAdd= () => {
    const {data:suggestedUser,isLoading} = useQuery({
		queryKey:["suggestedUser"],
		queryFn:async () =>{
			try {
				const res = await fetch("/api/users/suggested")
				const data = await res.json()
				if(!res.ok)  throw new Error(data.error || "something went wrong")
				return data 
			} catch (error) {
				throw new Error(error.message)
			}
		}
	})
	const {follow,isPending} = useFollow()
    return(<div className='flex-[4_4_0] mr-auto  border-r border-gray-700 min-h-screen'>
			<div className=' rounded-md sticky top-2'>
				<p className='font-bold  bg-[#16181C] p-4'>Who to follow</p>
				<div className='flex flex-col gap-4 pt-6 pr-6 pl-6'>
					{isLoading && (
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
					{!isLoading &&
						suggestedUser?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4 bg-[#16181C] p-2 rounded-lg'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullname}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {e.preventDefault();
											follow(user._id)}}
									>
										{isPending? <LoadingSpinner size="sm"/>:"Follow" }
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
 