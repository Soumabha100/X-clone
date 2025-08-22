import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import { Notification } from "../models/notificationSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import populateOptions from "../config/populateOptions.js";

/**
 * Fetches the profile of the currently authenticated user.
 * Relies on the 'isAuthenticated' middleware to provide the user ID.
 */
export const getMe = async (req, res) => {
  try {
    // The user ID is securely attached to the request object by our middleware.
    const id = req.user;
    const user = await User.findById(id).select("-password"); // Exclude the password for security.
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Handles new user registration.
 */
export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    // Create the new user and get the created document back
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // --- NEW LOGIN LOGIC ---
    // Sign a token for the new user
    const tokenData = { userId: newUser._id };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Send the token as a cookie and return the user data, just like in the Login function
    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome, ${newUser.name}!`,
        user: newUser,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Handles user login with either an email or a username.
 */
export const Login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Find the user by either their email or username for flexibility.
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email, username, or password",
        success: false,
      });
    }

    // Compare the provided password with the hashed password in the database.
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email, username, or password",
        success: false,
      });
    }

    // If credentials are correct, sign a new JWT.
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Send the token back as an httpOnly cookie for security.
    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Logs out the user by clearing their authentication cookie.
 */
export const logout = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "user logged out successfully.",
    success: true,
  });
};

/**
 * Toggles a bookmark on a tweet for the logged-in user.
 */
export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isBookmarked =
      Array.isArray(user.bookmarks) &&
      user.bookmarks.map((id) => id.toString()).includes(tweetId);

    if (isBookmarked) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: tweetId },
      });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: tweetId },
      });
    }

    const updatedUser = await User.findById(loggedInUserId).select("-password");
    return res.status(200).json({
      message: isBookmarked ? "Removed from bookmarks." : "Saved to bookmarks.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetches the public profile of any user by their ID.
 */
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fetches a list of other users (excluding the logged-in user).
 * Used for the "Who to Follow" section.
 */
export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    // Find all users where the ID is "not equal" ($ne) to the logged-in user's ID.
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(401).json({
        message: "Currently do not have any users.",
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Allows the logged-in user to follow another user.
 */
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const userId = req.params.id;

    // Prevent a user from following themselves.
    if (loggedInUserId === userId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      // Add the follower/following relationship.
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });

      // Create a notification for the user who was followed.
      await Notification.create({
        type: "follow",
        fromUser: loggedInUserId,
        toUser: userId,
      });
    } else {
      return res.status(400).json({
        message: `User already followed ${user.name}`,
      });
    }
    // Return the updated profile of the logged-in user for instant UI updates.
    const updatedLoggedInUser = await User.findById(loggedInUserId).select(
      "-password"
    );
    return res.status(200).json({
      message: `${loggedInUser.name} just followed ${user.name}`,
      user: updatedLoggedInUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Allows the logged-in user to unfollow another user.
 */
export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      // Remove the follower/following relationship.
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
      });
    }
    // Return the updated profile of the logged-in user.
    const updatedLoggedInUser = await User.findById(loggedInUserId).select(
      "-password"
    );
    return res.status(200).json({
      message: `${loggedInUser.name} unfollowed ${user.name}`,
      user: updatedLoggedInUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 *  Handles updating a user's profile information, including text and images.
 */

export const editProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const { name, bio } = req.body;

    // Find the user to update.
    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update text fields if they were provided.
    if (name) user.name = name;
    if (bio) user.bio = bio;

    // Multer provides uploaded file info in req.files.
    // We check for 'profileImg' and 'bannerImg' and save their Cloudinary URLs.
    if (req.files) {
      if (req.files.profileImg) {
        user.profileImg = req.files.profileImg[0].path;
      }
      if (req.files.bannerImg) {
        user.bannerImg = req.files.bannerImg[0].path;
      }
    }

    // Save the updated user document.
    await user.save();

    // Return the updated user object (without the password).
    const updatedUser = await User.findById(loggedInUserId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Handles deleting a user and cleaning up all their associated data.
 */
export const deleteUser = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const userIdToDelete = req.params.id;

    // Security Check: Ensure the logged-in user is deleting their own account.
    // In a real app, you might also allow an admin to do this.
    if (loggedInUserId.toString() !== userIdToDelete) {
      return res
        .status(403)
        .json({
          message: "Unauthorized. You can only delete your own account.",
        });
    }

    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    // --- Start Cleanup Process ---

    // 1. Delete all tweets created by the user
    await Tweet.deleteMany({ userId: userIdToDelete });

    // 2. Delete all notifications related to the user (sent or received)
    await Notification.deleteMany({
      $or: [{ fromUser: userIdToDelete }, { toUser: userIdToDelete }],
    });

    // 3. Remove this user from the 'followers' list of users they were following
    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { followers: userIdToDelete } }
    );

    // 4. Remove this user from the 'following' list of their followers
    await User.updateMany(
      { _id: { $in: userToDelete.followers } },
      { $pull: { following: userIdToDelete } }
    );

    // 5. Remove the user's likes, retweets, and bookmarks from all tweets in the database
    await Tweet.updateMany(
      {},
      {
        $pull: {
          like: userIdToDelete,
          retweetedBy: userIdToDelete,
          bookmarks: userIdToDelete, // Note: bookmarks are on the user, this is for tweets if you add it there
        },
      }
    );

    // 6. Finally, delete the user document itself
    await User.findByIdAndDelete(userIdToDelete);

    // 7. Clear the authentication cookie
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
      message: `User ${userToDelete.username} has been successfully deleted.`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fetches all tweets that the logged-in user has bookmarked.
 */
export const getBookmarkedTweets = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const user = await User.findById(loggedInUserId).populate({
      path: "bookmarks",
      populate: populateOptions,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const bookmarkedTweets = Array.isArray(user.bookmarks)
      ? [...user.bookmarks].reverse()
      : [];

    return res.status(200).json(bookmarkedTweets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
