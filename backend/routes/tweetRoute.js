import express from "express";
import multer from "multer";
import storage from "../config/cloudinary.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislike,
  editTweet,
  getFeedTweets, // <-- IMPORT THE NEW FUNCTION
  getUserTweets,
  createComment,
  retweet,
  getTweetById,
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";
import { body } from "express-validator"; // <-- IMPORT VALIDATOR

const router = express.Router();
const upload = multer({ storage });

// --- Tweet Routes ---

// Create a new tweet (with validation)
router
  .route("/create")
  .post(
    isAuthenticated,
    upload.single("image"),
    [
      body("description", "Tweet description cannot be empty").not().isEmpty(),
      body("description", "Tweet cannot be more than 280 characters").isLength({
        max: 280,
      }),
    ],
    createTweet
  );

// Get tweets for the main feed ('For you' or 'Following')
router.route("/feed").get(isAuthenticated, getFeedTweets);

// Get all tweets for a specific user's profile
router.route("/user/:id").get(isAuthenticated, getUserTweets);

// Get a single tweet by its ID
router.route("/:id").get(isAuthenticated, getTweetById);

// Delete a tweet
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);

// Like or dislike a tweet
router.route("/like/:id").put(isAuthenticated, likeOrDislike);

// Edit a tweet
router.route("/edit/:id").put(isAuthenticated, editTweet);

// Add a comment to a tweet
router.route("/comment/:id").post(isAuthenticated, createComment);

// Retweet or un-retweet
router.route("/retweet/:id").post(isAuthenticated, retweet);

export default router;
