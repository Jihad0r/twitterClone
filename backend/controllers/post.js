import Post from "../models/post.js"
import User from "../models/user.js"
import Notification from "../models/notification.js"
import {v2 as cloudinary} from "Cloudinary"

export const createPost= async (req,res)=>{
    try{
        const {text} = req.body
        let {img} = req.body
        const userId = req.user._id

        const user = await User.findById(userId)
		if (!user) return res.status(404).json({ message: "User not found" });
        if(!text && !img){
             return res.status(404).json({ message: "Post must have something" });
        }
        if(img){
            const uploadedResponse =  await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user:userId,
            text,
            img,
        })
        await newPost.save()
        res.status(201).json(newPost)

    }catch(error){
        res.status(500).json({error:error.message})
    }
}
export const deletePost =async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
		if (!post) return res.status(404).json({ message: "Post not found" });
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(404).json({ message: "not authorize"});
        }
        if(post.img){
            const Img = post.img.split("/").pop().split(".")[0]
			await cloudinary.uploader.destroy(Img);
        }
        await Post.findByIdAndDelete(req.params.id)
        
        res.status(200).json({message: "Post deleted"})
    }catch(error){
        res.status(500).json({error:error.message})
    }
}
export const commentPost = async (req, res) => {
    try {
		const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
        }
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
        }

		const comment = { user: userId, text };

        post.comments.push(comment);
        await post.save();

		res.status(200).json(post.comments);
    } catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
};

export const likePost = async (req,res) =>{
    try {
        const postId = req.params.id     
        const userId = req.user._id

        
        const post = await Post.findById(postId)
		if (!post) return res.status(404).json({ message: "Post not found" });
		const islike = post.likes.includes(userId);

		if (islike) {
			await Post.updateOne({_id:postId}, { $pull: { likes: userId} });
            await User.updateOne({_id:userId}, { $pull: { likePosts: postId} });
            const updatedLikes = post.likes.filter((id)=> id.toString()!== userId.toString())
            
			res.status(200).json(updatedLikes);
		} else {
			post.likes.push(userId);
            await User.updateOne({_id:userId}, { $push: { likePosts: postId} });
            await post.save();
			const newNotification = new Notification({
				type: "like",
				from: userId,
				to: post.user,
			});

			await newNotification.save();
            const updatedLikes = post.likes 
            console.log(updatedLikes) 
			res.status(200).json(updatedLikes);
		}
    }catch(error){
        console.log(error.message)
        res.status(500).json({error:error.message})
    }
}
export const allPosts = async (req,res)=>{
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
        res.status(500).json({error:error.message})
	}
};

export const getallLikePosts = async (req,res) =>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId)
		if (!user) return res.status(404).json({ message: "User not found" });
        const likePosts = await Post.find({_id:{$in:user.likePosts}}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
         
        res.status(201).json(likePosts)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getfollowingPosts = async (req,res)=>{
    try{
        const userId = req.user._id
        const user = await User.findById(userId)
		if (!user) return res.status(404).json({ message: "User not found" });
        
        const following = user.following
        const followingPosts = await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(201).json(followingPosts)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getUserPosts = async (req,res)=>{
    try{
        const {username}= req.params
        const user = await User.findOne({username})
		if (!user) return res.status(404).json({ message: "User not found" });
        
        const following = user.following
        const posts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(201).json(posts)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}