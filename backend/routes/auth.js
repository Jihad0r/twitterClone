import express from "express"
import {signup,login,logout,myaccount} from "../controllers/auth.js"
import { protactRouter } from "../middleware/protactRouter.js"


const router = express.Router()


router.post("/signup",signup)
router.get("/myaccount",protactRouter,myaccount)
router.post("/login",login)
router.post("/logout",logout)

export default router