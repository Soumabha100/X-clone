import express from 'express';

import {protectRoute} from "../middlewares/auth.middleware.js";
import {getPosts, getPost, createPost, likePost,deletePost, getUserPosts} from '../controllers/post.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router =  express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:PostId", getPost);
router.get("/user/:username", getUserPosts);

// protected Routes
router.post("/", protectRoute, upload.single("image") ,createPost);
router.post("/:postId/like", protectRoute, likePost);
router.delete("/:postId/like", protectRoute, deletePost);

export default router;