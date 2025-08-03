import mongoose from "mongoose";

// We can define a schema for comments to keep them structured
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    // ADD THIS NEW FIELD
    comments: [commentSchema], // An array of comments using the schema above
  },
  { timestamps: true }
);
export const Tweet = mongoose.model("Tweet", tweetSchema);
