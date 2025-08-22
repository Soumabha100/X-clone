import { Tweet } from "../models/tweetSchema.js";
import { Notification } from "../models/notificationSchema.js";
import { User } from "../models/userSchema.js";
import populateOptions from "../config/populateOptions.js";

// A helper object for Mongoose's .populate() method.

// UPDATED createTweet function to handle both image and text-only posts correctly
export const createTweet = async (req, res) => {
  try {
    const { description } = req.body;
    // THIS IS THE FIX: Get the user ID from the secure session, not the request body.
    const id = req.user;

    // The image URL from Cloudinary is provided by multer in req.file.path.
    const imageUrl = req.file ? req.file.path : "";

    // A tweet must have a description.
    if (!description) {
      return res.status(401).json({
        message: "Description is required.",
        success: false,
      });
    }

    const newTweet = await Tweet.create({
      description,
      userId: id,
      image: imageUrl, // Save the Cloudinary URL.
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

/**
 * Deletes a tweet, ensuring only the original author can do so.
 */
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the tweet to delete.
    const loggedInUserId = req.user; // The ID of the user making the request.

    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found.",
        success: false,
      });
    }

    // Security check: Verify that the logged-in user is the tweet's author.
    if (tweet.userId.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this tweet.",
        success: false,
      });
    }

    // If the check passes, delete the tweet.
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred.",
      success: false,
    });
  }
};

/**
 * Toggles the "like" status of a tweet for the logged-in user.
 */
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    if (tweet.like.includes(loggedInUserId)) {
      // If already liked, dislike (remove the user's ID from the 'like' array).
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      const updatedTweet = await Tweet.findById(tweetId).populate(
        populateOptions
      );
      return res.status(200).json({
        message: "User disliked your tweet.",
        tweet: updatedTweet,
      });
    } else {
      // If not liked, like (add the user's ID to the 'like' array).
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });

      // Create a notification for the tweet's author, but only if it's not their own tweet.
      if (loggedInUserId.toString() !== tweet.userId.toString()) {
        await Notification.create({
          type: "like",
          fromUser: loggedInUserId,
          toUser: tweet.userId,
          tweetId: tweet._id,
        });
      }

      const updatedTweet = await Tweet.findById(tweetId).populate(
        populateOptions
      );
      return res.status(200).json({
        message: "User liked your tweet.",
        tweet: updatedTweet,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Toggles the "retweet" status of a tweet for the logged-in user.
 */
export const retweet = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }

    // Check if the user has already retweeted this tweet
    if (tweet.retweetedBy.includes(loggedInUserId)) {
      // If so, un-retweet it
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { retweetedBy: loggedInUserId },
      });
      const updatedTweet = await Tweet.findById(tweetId).populate(
        populateOptions
      );
      return res.status(200).json({
        message: "Retweet removed.",
        tweet: updatedTweet,
      });
    } else {
      // If not, retweet it
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { retweetedBy: loggedInUserId },
      });

      // (Optional) You could add a notification here for retweets as well
      // await Notification.create({ ... });

      const updatedTweet = await Tweet.findById(tweetId).populate(
        populateOptions
      );
      return res.status(200).json({
        message: "Tweet retweeted successfully.",
        tweet: updatedTweet,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetches the main feed for a user (their own tweets + tweets from people they follow).
 */
export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const followingIds = loggedInUser.following;
    const selfId = loggedInUser._id;

    const feedTweets = await Tweet.find({
      $or: [
        // Condition 1: Tweets created by people the user follows.
        { userId: { $in: followingIds } },
        // Condition 2: Tweets retweeted by the user OR people they follow.
        { retweetedBy: { $in: [...followingIds, selfId] } },
      ],
    })
      .populate(populateOptions)
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      tweets: feedTweets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetches tweets only from users the logged-in user is following.
 */
export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId }).populate(populateOptions);
      })
    );
    const allFollowingTweets = [].concat(...followingUserTweet);
    return res.status(200).json({
      tweets: allFollowingTweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fetches all tweets belonging to a specific user's profile.
 */
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

/**
 * Fetches all tweets from all users for the public "For you" feed.
 */
export const getPublicTweets = async (req, res) => {
  try {
    const allPublicTweets = await Tweet.find()
      .populate(populateOptions)
      .sort({ updatedAt: -1 }); // Sort by updatedAt for consistency with retweets
    return res.status(200).json(allPublicTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Edits a tweet's description, ensuring only the author can do so.
 */
export const editTweet = async (req, res) => {
  try {
    const { id: tweetId } = req.params;
    const { description } = req.body;
    const loggedInUserId = req.user;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found." });
    }
    // Security check: Verify ownership.
    if (tweet.userId.toString() !== loggedInUserId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this tweet." });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description cannot be empty." });
    }
    // Update the description and mark the tweet as edited.
    tweet.description = description;
    tweet.isEdited = true;
    await tweet.save();
    // Return the fully populated, updated tweet.
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

/**
 * Adds a new comment to a specific tweet.
 */
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
    // Add the new comment to the tweet's 'comments' array.
    tweet.comments.push(newComment);
    await tweet.save();

    // Create a notification for the tweet's author, unless they are commenting on their own tweet.
    if (loggedInUserId.toString() !== tweet.userId.toString()) {
      await Notification.create({
        type: "comment",
        fromUser: loggedInUserId,
        toUser: tweet.userId,
        tweetId: tweet._id,
      });
    }

    // Return the fully populated, updated tweet.
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

/**
 * Fetches a single tweet by its ID.
 */
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
