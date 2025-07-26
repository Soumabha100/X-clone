import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { createComment, getComments, deleteComment} from "../controllers/comment.controller.js"

const router = express.Router();

// Public Routes
router.get("/post/:postId", getComments);

// Protected Routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/commentId", protectRoute, deleteComment);

export default router;