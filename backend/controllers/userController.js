import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import { Notification } from "../models/notificationSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import populateOptions from "../config/populateOptions.js";

/**
 * Fetches the profile of the currently authenticated user.
 */
export const getMe = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id).select("-password");
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

    const hashedPassword = await bcryptjs.hash(password, 12); // Optimal speed

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const tokenData = { userId: newUser._id };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    };

    // Return a lean user object without the password
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        message: `Welcome, ${newUser.name}!`,
        user: userToReturn,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * OPTIMIZED Handles user login.
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

    // Efficiently find the user and select only necessary fields
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password"); // Explicitly include password for comparison

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email, username, or password",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email, username, or password",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    };

    // Prepare a lean user object to send back, excluding the password
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return res
      .status(200) // Changed to 200 for successful login
      .cookie("token", token, cookieOptions)
      .json({
        message: `Welcome back, ${user.name}`,
        user: userToReturn,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Handles the "forgot password" request.
 * In a real app, this would send an email with a reset link.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a short-lived token for password reset
    const resetToken = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "15m", // Token is valid for 15 minutes
    });

    // **For development, we'll just log the token.**
    // In production, you would use a service like Nodemailer to send an email.
    console.log(`Password Reset Token for ${email}: ${resetToken}`);
    
    // Send the token back in the response so you can test it
    res.status(200).json({
      message: "Password reset token generated. Check server logs.",
      resetToken: resetToken, // Sending it back for easy testing
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Handles the actual password reset.
 */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "New password is required." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;

        // Hash the new password with the FAST method
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Update the user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({
            message: "Password has been successfully reset. Please log in.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token." });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


/**
 * Logs out the user by clearing their authentication cookie.
 */
export const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .cookie("token", "", { ...cookieOptions, expiresIn: new Date(Date.now()) })
    .json({
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
 */
export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (loggedInUserId === userId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });

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
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
      });
    }
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
 * Handles updating a user's profile information, including text and images.
 */
export const editProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const { name, bio } = req.body;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (req.files) {
      if (req.files.profileImg) {
        user.profileImg = req.files.profileImg[0].path;
      }
      if (req.files.bannerImg) {
        user.bannerImg = req.files.bannerImg[0].path;
      }
    }

    await user.save();

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

    if (loggedInUserId.toString() !== userIdToDelete) {
      return res.status(403).json({
        message: "Unauthorized. You can only delete your own account.",
      });
    }

    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    await Tweet.deleteMany({ userId: userIdToDelete });

    await Notification.deleteMany({
      $or: [{ fromUser: userIdToDelete }, { toUser: userIdToDelete }],
    });

    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { followers: userIdToDelete } }
    );

    await User.updateMany(
      { _id: { $in: userToDelete.followers } },
      { $pull: { following: userIdToDelete } }
    );

    await Tweet.updateMany(
      {},
      {
        $pull: {
          like: userIdToDelete,
          retweetedBy: userIdToDelete,
        },
      }
    );

    await User.findByIdAndDelete(userIdToDelete);

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
