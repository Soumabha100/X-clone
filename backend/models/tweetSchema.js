import mongoose from "mongoose";

// Defines a sub-schema for individual comments.
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

// Defines the main schema for a single tweet document.
const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    // A field to store the image URL from Cloudinary.
    image: {
        type: String,
        default: "",
    },
    like: {
      type: Array,
      default: [],
    },

    retweetedBy: {
      type: Array,
      default: [],
    },
    isQuoteTweet: {
        type: Boolean,
        default: false,
    },
    originalTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
