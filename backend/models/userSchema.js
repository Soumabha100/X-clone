import mongoose from "mongoose";

/**
 * Defines the schema for a single user document in the database.
 */
const userSchema = new mongoose.Schema(
  {
    // The user's full name.
    name: {
      type: String,
      required: true,
    },
    // The user's unique handle or screen name.
    username: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can have the same username.
      index: true
    },
    // The user's unique email address, used for login and communication.
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can have the same email.
      index: true
    },
    // The user's hashed password.
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    // An array of user IDs who are following this user.
    followers: {
      type: Array,
      default: [],
    },
    // An array of user IDs that this user is following.
    following: {
      type: Array,
      default: [],
    },
    // An array of tweet IDs that the user has bookmarked.
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
  },
  { timestamps: true }
); // Automatically adds 'createdAt' and 'updatedAt' fields.

// Create and export the User model based on the schema.
export const User = mongoose.model("User", userSchema);
