import express from "express";
import {
  createComment,
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  likeOrDislike,
  getUserTweets,
  getPublicTweets,
  editTweet,
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

// Create a new router object from Express to handle tweet-related routes.
const router = express.Router();

// All routes defined here are protected by the 'isAuthenticated' middleware,
// ensuring that only logged-in users can access them.

// Route to create a new tweet.
// POST /api/v1/tweet/create
router.route("/create").post(isAuthenticated, createTweet);

// Route to delete a specific tweet by its ID.
// DELETE /api/v1/tweet/delete/:id
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);

// Route to like or dislike a specific tweet by its ID.
// PUT /api/v1/tweet/like/:id
router.route("/like/:id").put(isAuthenticated, likeOrDislike);

// Route to edit a specific tweet by its ID.
// PUT /api/v1/tweet/edit/:id
router.route("/edit/:id").put(isAuthenticated, editTweet);

// Route to get the main feed for a user (their tweets + tweets from people they follow).
// GET /api/v1/tweet/alltweets/:id
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);

// Route to get tweets only from users the logged-in user follows.
// GET /api/v1/tweet/followingtweets/:id
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);

// Route to get all tweets for a specific user's profile.
// GET /api/v1/tweet/user/:id
router.route("/user/:id").get(isAuthenticated, getUserTweets);

// Route to get all tweets from all users for the public "For you" feed.
// GET /api/v1/tweet/public
router.route("/public").get(isAuthenticated, getPublicTweets);

// Route to add a comment to a specific tweet by its ID.
// POST /api/v1/tweet/comment/:id
router.route("/comment/:id").post(isAuthenticated, createComment);

// Export the router to be used in the main server file (index.js).
export default router;
