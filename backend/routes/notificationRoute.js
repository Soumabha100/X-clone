    import express from "express";
    import { getNotifications, clearNotifications, getUnreadCount } from "../controllers/notificationController.js";
    import isAuthenticated from "../config/auth.js";

    const router = express.Router();

    router.route("/").get(isAuthenticated, getNotifications);
    router.route("/clear").delete(isAuthenticated, clearNotifications);
    router.route("/unread-count").get(isAuthenticated, getUnreadCount);

    export default router;
    