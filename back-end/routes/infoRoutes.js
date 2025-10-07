import express from "express";
import {
    createInfo,
    getAllInfo,
    getInfoById,
    updateInfo,
    deleteInfo
} from "../controllers/infoController.js";

const router = express.Router();

router.post("/", createInfo)
router.get("/info",getAllInfo); 

router.get("/:id", getInfoById)
router.put("/:id", updateInfo)   
router.delete("/:id", deleteInfo);

export default router;
