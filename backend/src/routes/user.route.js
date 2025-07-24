import express from 'express';
import {getUserProfile, syncUser, getCurrentUser,followUser, updateProfile} from "../controllers/user.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.router();

// public route
router.get("/profile/:username", getUserProfile);

// protected routes
router.post("/sync", protectRoute, syncUser);
router.post("/me", protectRoute, getCurrentUser);

router.put("/profile", protectRoute, updateProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);



export default router;