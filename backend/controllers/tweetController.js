import { Tweet } from "../models/tweetSchema.js";
import { Notification } from "../models/notificationSchema.js";
import { User } from "../models/userSchema.js";
import populateOptions from "../config/populateOptions.js";
import { validationResult } from "express-validator";

//  [CREATE] A NEW TWEET
export const createTweet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { description } = req.body;
    const id = req.user;
    const imageUrl = req.file ? req.file.path : "";

    const newTweet = await Tweet.create({
      description,
      userId: id,
      image: imageUrl,
    });

    const populatedTweet = await Tweet.findById(newTweet._id).populate(
      populateOptions
    );

    return res.status(201).json({
      message: "Tweet created successfully.",
      success: true,
      tweet: populatedTweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [DELETE] A TWEET
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    if (tweet.userId.toString() !== loggedInUserId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this tweet." });
    }

    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

//  [UPDATE] LIKE OR DISLIKE A TWEET
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    if (tweet.like.includes(loggedInUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });

      if (loggedInUserId.toString() !== tweet.userId.toString()) {
        await Notification.create({
          type: "like",
          fromUser: loggedInUserId,
          toUser: tweet.userId,
          tweetId: tweet._id,
        });
      }
    }

    const updatedTweet = await Tweet.findById(tweetId).populate(
      populateOptions
    );
    return res.status(200).json({
      message: "Like status updated.",
      tweet: updatedTweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// [UPDATE] RETWEET OR UN-RETWEET
export const retweet = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    if (tweet.retweetedBy.includes(loggedInUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { retweetedBy: loggedInUserId },
      });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { retweetedBy: loggedInUserId },
      });
    }

    const updatedTweet = await Tweet.findById(tweetId).populate(
      populateOptions
    );
    return res.status(200).json({
      message: "Retweet status updated.",
      tweet: updatedTweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [READ] GET ALL TWEETS FOR THE FEED (PUBLIC OR FOLLOWING)
export const getFeedTweets = async (req, res) => {
  try {
    const { feedType } = req.query; // 'public' or 'following'
    const loggedInUserId = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (feedType === "following") {
      const loggedInUser = await User.findById(loggedInUserId);
      if (!loggedInUser) {
        return res.status(404).json({ message: "User not found." });
      }
      query = { userId: { $in: loggedInUser.following } };
    }

    const tweets = await Tweet.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTweets = await Tweet.countDocuments(query);

    return res.status(200).json({
      tweets,
      totalPages: Math.ceil(totalTweets / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [READ] GET ALL TWEETS FOR A SPECIFIC USER'S PROFILE
export const getUserTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const userTweets = await Tweet.find({ userId: id })
      .populate(populateOptions)
      .sort({ createdAt: -1 });
    return res.status(200).json(userTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [UPDATE] EDIT A TWEET
export const editTweet = async (req, res) => {
  try {
    const { id: tweetId } = req.params;
    const { description } = req.body;
    const loggedInUserId = req.user;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }
    if (tweet.userId.toString() !== loggedInUserId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this tweet." });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description cannot be empty." });
    }
    tweet.description = description;
    tweet.isEdited = true;
    await tweet.save();
    const updatedTweet = await Tweet.findById(tweetId).populate(
      populateOptions
    );
    return res.status(200).json({
      message: "Tweet updated successfully.",
      success: true,
      tweet: updatedTweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [CREATE] A NEW COMMENT
export const createComment = async (req, res) => {
  try {
    const { id: tweetId } = req.params;
    const { comment } = req.body;
    const loggedInUserId = req.user;
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }
    const newComment = {
      content: comment,
      userId: loggedInUserId,
    };
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }
    tweet.comments.push(newComment);
    await tweet.save();

    if (loggedInUserId.toString() !== tweet.userId.toString()) {
      await Notification.create({
        type: "comment",
        fromUser: loggedInUserId,
        toUser: tweet.userId,
        tweetId: tweet._id,
      });
    }

    const updatedTweet = await Tweet.findById(tweetId).populate(
      populateOptions
    );

    return res.status(201).json({
      message: "Comment added successfully.",
      success: true,
      tweet: updatedTweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  [READ] GET A SINGLE TWEET BY ITS ID
export const getTweetById = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId).populate(populateOptions);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    return res.status(200).json(tweet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
