import express from "express"

import { protactRouter } from "../middleware/protactRouter.js"
import {getNotifications,deleteNotifications,deleteNotification,updataotifications} from "../controllers/notification.js"

const router = express.Router()


router.get("/",protactRouter,getNotifications)
router.delete("/delete",protactRouter,deleteNotifications)
router.delete("/delete/:id",protactRouter,deleteNotification)
router.put("/:id",protactRouter,updataotifications)

export default router