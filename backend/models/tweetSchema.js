import mongoose from "mongoose";

/**
 * Defines a sub-schema for individual comments.
 * This structure will be embedded within the main tweet schema.
 */
const commentSchema = new mongoose.Schema(
  {
    // The text content of the comment.
    content: {
      type: String,
      required: true,
    },
    // A reference to the User who posted the comment.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' for each comment.
);

/**
 * Defines the main schema for a single tweet document in the database.
 */
const tweetSchema = new mongoose.Schema(
  {
    // The main text content of the tweet.
    description: {
      type: String,
      required: true,
    },
    // An array of user IDs who have liked the tweet.
    like: {
      type: Array,
      default: [],
    },
    // A reference to the User who authored the tweet.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // A flag to indicate if the tweet has been edited.
    isEdited: {
      type: Boolean,
      default: false,
    },
    // An array of comment documents, using the commentSchema defined above.
    comments: [commentSchema],
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' for the tweet itself.
);

// Create and export the Tweet model based on the schema.
export const Tweet = mongoose.model("Tweet", tweetSchema);
