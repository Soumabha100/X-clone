    import express from "express";
    import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeOrDislike, getUserTweets, getPublicTweets } from "../controllers/tweetController.js";
    import isAuthenticated from "../config/auth.js";

    const router = express.Router();
    
    router.route("/create").post(isAuthenticated,createTweet);
    router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
    router.route("/like/:id").put(isAuthenticated,likeOrDislike);
    router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
    router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
    router.route("/user/:id").get(isAuthenticated, getUserTweets);
    router.route("/public").get(isAuthenticated, getPublicTweets);

    export default router;
    