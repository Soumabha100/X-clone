import express from "express";
import {
  getNotifications,
  clearNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js";
import isAuthenticated from "../config/auth.js";

// Create a new router object from Express to handle notification-related routes.
const router = express.Router();

// Route to get all notifications for the logged-in user.
// GET /api/v1/notifications/
// The 'isAuthenticated' middleware runs first to ensure the user is logged in.
router.route("/").get(isAuthenticated, getNotifications);

// Route to delete all notifications for the logged-in user.
// DELETE /api/v1/notifications/clear
router.route("/clear").delete(isAuthenticated, clearNotifications);

// Route to get the count of unread notifications for the logged-in user.
// GET /api/v1/notifications/unread-count
router.route("/unread-count").get(isAuthenticated, getUnreadCount);

// Export the router to be used in the main server file (index.js).
export default router;
