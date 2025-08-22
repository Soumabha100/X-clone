import express from "express";
import multer from 'multer';
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
} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

// Create a new router object from Express to handle user-related routes.
const router = express.Router();
const upload = multer({ storage });

// --- Public Routes (No authentication required) ---

// Route to handle new user registration.
// POST /api/v1/user/register
router.route("/register").post(Register);

// Route to handle user login.
// POST /api/v1/user/login
router.route("/login").post(Login);

// Route to handle user logout.
// GET /api/v1/user/logout
router.route("/logout").get(logout);

// --- Protected Routes (Authentication required) ---
// The 'isAuthenticated' middleware will run before each of these controller functions.

// Route to get the profile of the currently authenticated user.
// GET /api/v1/user/me
router.route("/me").get(isAuthenticated, getMe);

// Route to bookmark or unbookmark a tweet.
// PUT /api/v1/user/bookmark/:id
router.route("/bookmark/:id").put(isAuthenticated, bookmark);

router.route("/bookmarks").get(isAuthenticated, getBookmarkedTweets);

// Route to get the public profile of any user by their ID.
// GET /api/v1/user/profile/:id
router.route("/profile/:id").get(isAuthenticated, getMyProfile);

// Route to get a list of other users to follow.
// GET /api/v1/user/otheruser/:id
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);

// Route for the logged-in user to follow another user.
// POST /api/v1/user/follow/:id
router.route("/follow/:id").post(isAuthenticated, follow);

// Route for the logged-in user to unfollow another user.
// POST /api/v1/user/unfollow/:id
router.route("/unfollow/:id").post(isAuthenticated, unfollow);

// This route uses upload.fields() to accept up to one file for each specified field.
router.route("/profile/edit").post(
  isAuthenticated,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
  ]),
  editProfile
);

// Delete Route
router.route("/delete/:id").delete(isAuthenticated, deleteUser);



// Export the router to be used in the main server file (index.js).
export default router;
