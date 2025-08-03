    import mongoose from "mongoose";

    const notificationSchema = new mongoose.Schema({
        type: {
            type: String,
            enum: ['like', 'comment', 'follow'],
            required: true,
        },
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tweetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true });

    export const Notification = mongoose.model("Notification", notificationSchema);
    