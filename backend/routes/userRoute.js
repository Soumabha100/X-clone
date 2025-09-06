import express from "express";
import multer from "multer";
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
import { body } from "express-validator";

const router = express.Router();
const upload = multer({ storage });

// --- Public Routes (No authentication required) ---

// Route to handle new user registration.
// POST /api/v1/user/register
router.route("/register").post(Register);

// Route to handle user login.
// POST /api/v1/user/login
router
  .route("/login")
  .post(
    [
      body("identifier", "Please enter a valid email or username")
        .not()
        .isEmpty(),
      body("password", "Password cannot be empty").not().isEmpty(),
    ],
    Login
  );

// Route to handle user logout.
// GET /api/v1/user/logout
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

// Export the router to be used in the main server file (index.js).
export default router;
