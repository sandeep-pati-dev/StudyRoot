import express from "express";
import upload from "../middleware/multer.js";
import { generateSummary } from "../controllers/summarize.controller.js";
import { protectRoute } from "../middleware/auth.moddleware.js";

const router = express.Router();

router.post("/generate", protectRoute, upload.single("file"), generateSummary);

export default router;
