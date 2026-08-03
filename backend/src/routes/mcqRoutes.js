import express from 'express';
import upload from '../middleware/multer.js';
import {  generateMcqs } from '../controllers/mcq.controller.js';
import {protectRoute} from '../middleware/auth.moddleware.js';

const router = express.Router();

// POST /api/mcq/upload
router.post('/generate',protectRoute, upload.single('file'), generateMcqs);

export default router;
