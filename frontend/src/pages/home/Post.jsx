import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatPostDate } from "../../utils/data";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const Post = () => {
	const [comment, setComment] = useState("");
	const {data:authUser} = useQuery({queryKey:["authUser"]})
	const queryClient = useQueryClient()
    const {id:post} = useParams()
    const {data:postUser,isLoading} = useQuery({
		queryKey: ["post"],
		queryFn:async()=>{
			try {
				const res = await fetch(`/api/posts/${post}`)
				const data = await res.json()
			if(!res.ok)  throw new Error(data.error || "something went wrong")
                console.log(data)
				return data
			} catch (error) {
				throw new Error(error.message)
			}
		}
	})
	const {mutate:likePost,isPending:isLiking}= useMutation({
		mutationFn: async()=>{
			try {
				const res = await fetch(`/api/posts/like/${postUser._id}`,{
					method:"POST",
				})
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.error||"something went wrong")
				}
                console.log(data)
				return data
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess:async()=>{
			
			queryClient.invalidateQueries({queryKey:["post"]})
		}
	})
	const {mutate:commenPost,isPending:isCommenting}= useMutation({
		mutationFn: async()=>{
			try {
				const res = await fetch(`/api/posts/comment/${postUser._id}`,{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({text:comment})
				})
				const data = await res.json()
				if(!res.ok){
					throw new Error(data.error||"something went wrong")
				}
                
                console.log(data)
				return data
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess:async()=>{
			queryClient.invalidateQueries({queryKey:["post"]})
		}
	})
	const postOwner = postUser?.user;
    const isLiked = postUser?.likes?.includes(authUser?._id);

	const formattedDate = formatPostDate(postUser?.createdAt);

	const handlePostComment = (e) => {
		e.preventDefault();
		
		if(isCommenting)return;
		commenPost()
	};

	const handleLikePost = () => {
		if(isLiking)return;
		likePost()
	};

	return (
		<> {isLoading && <PostSkeleton/> }
        {!isLoading &&  
			<div className='flex-[4_4_0]  bg-stone-950  mr-auto border-r p-4 border-gray-700 min-h-screen'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-20 h-20 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
                    <div className='flex gap-2 ml-4 text-lg items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullname}
						</Link>
						<span className='text-gray-700  flex gap-1 text-md'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
					</div>
				</div>
				<div className='flex flex-col flex-1 '>
					
					<div className='flex flex-col gap-3 overflow-hidden border-t font-bold border-b h-[150px] p-4 border-gray-700'>
						<span>{postUser?.text}</span>
						{postUser?.img && (
							<img
								src={postUser?.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + postUser._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{postUser.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{postUser.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{postUser.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullname}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username} . {formatPostDate(comment.createdAt)}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<LoadingSpinner size="md"/>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
							{isLiking &&<LoadingSpinner size="md"/>}
								{!isLiked&&!isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked &&!isLiking&& <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{postUser.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>}
		</>
	);
};
export default Post;