import express from "express";
import multer from "multer";
import storage from "../config/cloudinary.js"; // Import our Cloudinary storage config
import {
  createTweet,
  deleteTweet,
  likeOrDislike,
  editTweet,
  getAllTweets,
  getFollowingTweets,
  getUserTweets,
  getPublicTweets,
  createComment,
  retweet,
  getTweetById,
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
// Initialize multer with our Cloudinary storage engine.
const upload = multer({ storage });

// --- CORRECTED ROUTE ORDER ---

// Specific routes first
router
  .route("/create")
  .post(isAuthenticated, upload.single("image"), createTweet);
router.route("/public").get(isAuthenticated, getPublicTweets); // <-- MOVED UP
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
router.route("/user/:id").get(isAuthenticated, getUserTweets);

// Dynamic routes with an `:id` parameter last
router.route("/:id").get(isAuthenticated, getTweetById); // <-- NOW AFTER SPECIFIC ROUTES
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/edit/:id").put(isAuthenticated, editTweet);
router.route("/comment/:id").post(isAuthenticated, createComment);
router.route("/retweet/:id").post(isAuthenticated, retweet);

export default router;
