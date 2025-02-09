import express from "express"

import { protactRouter } from "../middleware/protactRouter.js"
import {allPosts,getallLikePosts,getfollowingPosts,getUserPosts,createPost,deletePost,commentPost,likePost,getPost} from "../controllers/post.js"

const router = express.Router()


router.get("/all",protactRouter,allPosts)
router.get("/users/:username",protactRouter,getUserPosts)
router.get("/following",protactRouter,getfollowingPosts)
router.get("/likes/:id",protactRouter,getallLikePosts)
router.post("/create",protactRouter,createPost)
router.delete("/delete/:id",protactRouter,deletePost)
router.post("/like/:id",protactRouter,likePost)
router.post("/comment/:id",protactRouter,commentPost)
router.get("/:id",getPost)

export default router