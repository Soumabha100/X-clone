import mongoose from "mongoose";

/**
 * Defines the schema for a single notification document in the database.
 */
const notificationSchema = new mongoose.Schema({
    // The type of notification (e.g., like, comment, or follow).
    type: {
        type: String,
        enum: ['like', 'comment', 'follow'], // Restricts the value to one of these three strings.
        required: true,
    },
    // The user who triggered the notification.
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, // Stores a reference to a User document's ID.
        ref: 'User', // Specifies that this ID refers to the 'User' model.
        required: true,
    },
    // The user who will receive the notification.
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Optional: The specific tweet related to the notification (for likes and comments).
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    // A flag to track if the notification has been seen by the user.
    isRead: {
        type: Boolean,
        default: false, // Defaults to 'false' for new notifications.
    },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields.

// Create and export the Notification model based on the schema.
export const Notification = mongoose.model("Notification", notificationSchema);
