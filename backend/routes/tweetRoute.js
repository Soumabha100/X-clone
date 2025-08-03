    import express from "express";
    import {createComment ,createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeOrDislike, getUserTweets, getPublicTweets, editTweet } from "../controllers/tweetController.js";
    import isAuthenticated from "../config/auth.js";

    const router = express.Router();
    
    router.route("/create").post(isAuthenticated,createTweet);
    router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
    router.route("/like/:id").put(isAuthenticated,likeOrDislike);
    router.route("/edit/:id").put(isAuthenticated, editTweet);
    router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
    router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
    router.route("/user/:id").get(isAuthenticated, getUserTweets);
    router.route("/public").get(isAuthenticated, getPublicTweets);
    router.route("/comment/:id").post(isAuthenticated, createComment);

    export default router;
    