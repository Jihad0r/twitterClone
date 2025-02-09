import express from "express"
import {sendMessage,getMessage,userChats} from "../controllers/chat.js"
import { protactRouter } from "../middleware/protactRouter.js"


const router = express.Router()


router.get("/:id",protactRouter,getMessage)
router.get("/",protactRouter,userChats)
router.post("/send/:id",protactRouter,sendMessage)


export default router