import express from "express"

import { protactRouter } from "../middleware/protactRouter.js"
import {updateUser,followUser, getUserProfile,getSuggestedUser } from "../controllers/user.js"

const router = express.Router()


router.get("/profile/:username",protactRouter,getUserProfile)
router.get("/suggested",protactRouter,getSuggestedUser)
router.post("/follow/:id",protactRouter,followUser)
router.post("/update",protactRouter,updateUser)

export default router