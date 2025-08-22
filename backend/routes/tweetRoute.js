import express from "express";
import multer from 'multer';
import storage from '../config/cloudinary.js'; // Import our Cloudinary storage config
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
    retweet
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
// Initialize multer with our Cloudinary storage engine.
const upload = multer({ storage }); 

// UPDATED create route:
// The 'upload.single("image")' middleware will process one file named "image"
// before the createTweet controller is called.
router.route("/create").post(isAuthenticated, upload.single("image"), createTweet);

router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/edit/:id").put(isAuthenticated, editTweet);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
router.route("/user/:id").get(isAuthenticated, getUserTweets);
router.route("/public").get(isAuthenticated, getPublicTweets);
router.route("/comment/:id").post(isAuthenticated, createComment);
router.route("/retweet/:id").post(isAuthenticated, retweet);

export default router;
