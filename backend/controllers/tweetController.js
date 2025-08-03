import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: "Fields are required.",
        success: false,
      });
    }
    const newTweet = await Tweet.create({
      description,
      userId: id,
    });
    const populatedTweet = await Tweet.findById(newTweet._id).populate({
      path: "userId",
      select: "name username",
    });
    return res.status(201).json({
      message: "Tweet created successfully.",
      success: true,
      tweet: populatedTweet,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user;

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found.",
        success: false,
      });
    }

    if (tweet.userId.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this tweet.",
        success: false,
      });
    }

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

export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (tweet.like.includes(loggedInUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "User disliked your tweet.",
      });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "User liked your tweet.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userId: id }).populate({
      path: "userId",
      select: "name username",
    });

    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId }).populate({
          path: "userId",
          select: "name username",
        });
      })
    );

    const allTweets = loggedInUserTweets.concat(...followingUserTweet);

    return res.status(200).json({
      tweets: allTweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId }).populate({
          path: "userId",
          select: "name username",
        });
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

export const getUserTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const userTweets = await Tweet.find({ userId: id })
      .populate({
        path: "userId",
        select: "name username",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(userTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPublicTweets = async (req, res) => {
  try {
    const allPublicTweets = await Tweet.find()
      .populate({
        path: "userId",
        select: "name username",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(allPublicTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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

    // Update the tweet
    tweet.description = description;
    tweet.isEdited = true; // THIS IS THE MISSING LINE
    await tweet.save();

    // Find the updated tweet and populate it to send back
    const updatedTweet = await Tweet.findById(tweetId).populate({
      path: "userId",
      select: "name username",
    });

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
