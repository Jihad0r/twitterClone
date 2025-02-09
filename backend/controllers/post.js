import Post from "../models/post.js"
import User from "../models/user.js"
import Notification from "../models/notification.js"
import {v2 as cloudinary} from "cloudinary"


export const getPost = async (req,res)=>{
	try {
        const postId = req.params.id;

		const post = await Post.findById(postId)
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

        if (!post) return res.status(404).json({ error: "Post not found" });
		res.status(200).json(post);
	} catch (error) {
        res.status(500).json({error:error.message})
	}
};

export const createPost= async (req,res)=>{   
    try{
        const {text} = req.body
        let {img} = req.body
        const userId = req.user._id.toString()

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
        let { img } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text?.trim() && !img) {
            return res.status(400).json({ message: "Comment must have text or an image" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (error) {
                return res.status(500).json({ error: "Image upload failed" });
            }
        }


        const comment = { user: userId, text, img };
        post.comments.push(comment); 
        console.log("asdasf",comment)
        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });

        if (post.user.toString() !== userId.toString()) {
            const newNotification = new Notification({ type: "comment", from: userId, to: post.user, post:postId});
            await newNotification.save();
        }
       
        res.status(200).json(updatedPost.comments);
    } catch (error) {
        console.error("Error in commentPost controller:", error);
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

            if(post.user.toString() !== userId.toString()){
                const newNotification = new Notification({
				type: "like",
				from: userId,
				to: post.user,
			    post:postId});
                await newNotification.save();
            }
            const updatedLikes = post.likes
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