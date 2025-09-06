import express from "express";
import multer from "multer";
import storage from "../config/cloudinary.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislike,
  editTweet,
  getFeedTweets,
  getUserTweets,
  createComment,
  retweet,
  getTweetById,
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";
import { body } from "express-validator";

const router = express.Router();
const upload = multer({ storage });

// --- Tweet Routes ---

// [CREATE]
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

// [READ]
// Specific text routes must come before dynamic routes with an ':id' parameter.
router.route("/feed").get(isAuthenticated, getFeedTweets);
router.route("/user/:id").get(isAuthenticated, getUserTweets);

// This dynamic route must be last to avoid catching text-based routes.
router.route("/:id").get(isAuthenticated, getTweetById);

// [UPDATE]
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/edit/:id").put(isAuthenticated, editTweet);
router.route("/retweet/:id").post(isAuthenticated, retweet);
router.route("/comment/:id").post(isAuthenticated, createComment);

// [DELETE]
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);

export default router;
