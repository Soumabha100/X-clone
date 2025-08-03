import { Notification } from "../models/notificationSchema.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user;
    const notifications = await Notification.find({ toUser: userId })
      .populate({
        path: "fromUser",
        select: "name username",
      })
      .sort({ createdAt: -1 });

    // Mark all fetched notifications as read
    await Notification.updateMany(
      { toUser: userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    const userId = req.user;
    await Notification.deleteMany({ toUser: userId });
    return res
      .status(200)
      .json({ message: "Notifications cleared successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUnreadCount = async (req, res) => {
        try {
            const userId = req.user;
            const count = await Notification.countDocuments({ toUser: userId, isRead: false });
            return res.status(200).json({ count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
