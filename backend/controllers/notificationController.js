import { Notification } from "../models/notificationSchema.js";

/**
 * Fetches all notifications for the logged-in user and marks them as read.
 */
export const getNotifications = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request object (provided by middleware).
    const userId = req.user;

    // Find all notifications for this user.
    const notifications = await Notification.find({ toUser: userId })
      // Populate the 'fromUser' field to include the sender's name and username.
      .populate({
        path: "fromUser",
        select: "name username",
      })
      // Sort by newest first.
      .sort({ createdAt: -1 });

    // Once fetched, mark all unread notifications as read for this user.
    await Notification.updateMany(
      { toUser: userId, isRead: false },
      { isRead: true }
    );

    // Return the fetched notifications.
    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Deletes all notifications for the currently logged-in user.
 */
export const clearNotifications = async (req, res) => {
  try {
    // Get the authenticated user's ID.
    const userId = req.user;

    // Delete all notifications where this user is the recipient.
    await Notification.deleteMany({ toUser: userId });

    // Send a success confirmation.
    return res
      .status(200)
      .json({ message: "Notifications cleared successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Counts the number of unread notifications for the logged-in user.
 * Used for the notification badge in the UI.
 */
export const getUnreadCount = async (req, res) => {
  try {
    // Get the authenticated user's ID.
    const userId = req.user;

    // Count documents where the user is the recipient and isRead is false.
    const count = await Notification.countDocuments({
      toUser: userId,
      isRead: false,
    });

    // Return the final count.
    return res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
