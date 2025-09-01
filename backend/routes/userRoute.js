import express from "express";
import multer from "multer";
import storage from "../config/cloudinary.js";
import {
  Login,
  Register,
  bookmark,
  follow,
  getMyProfile,
  getOtherUsers,
  logout,
  unfollow,
  getMe,
  editProfile,
  deleteUser,
  getBookmarkedTweets,
  forgotPassword, 
  resetPassword, 
} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
const upload = multer({ storage });

// --- Password Reset Routes ---
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// --- Public Routes ---
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);

// --- Protected Routes ---
router.route("/me").get(isAuthenticated, getMe);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);
router.route("/bookmarks").get(isAuthenticated, getBookmarkedTweets);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/profile/edit").post(
  isAuthenticated,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
  ]),
  editProfile
);
router.route("/delete/:id").delete(isAuthenticated, deleteUser);

export default router;
