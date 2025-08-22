import React, { useEffect, useCallback } from "react";
import {
  IoIosSettings,
  IoMdHeart,
  IoMdPerson,
  IoMdChatbubbles,
} from "react-icons/io";
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setNotifications } from "../redux/notificationSlice";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8000/api/v1";

//Test

// A helper component to render the correct icon based on the notification type.
const NotificationIcon = ({ type }) => {
  if (type === "like") return <IoMdHeart className="text-pink-600 text-2xl" />;
  if (type === "follow")
    return <IoMdPerson className="text-blue-500 text-2xl" />;
  if (type === "comment")
    return <IoMdChatbubbles className="text-green-500 text-2xl" />;
  return null;
};

const Notifications = () => {
  const { notifications } = useSelector((store) => store.notification);
  const dispatch = useDispatch();

  // Fetches all notifications for the logged-in user.
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        withCredentials: true,
      });
      dispatch(setNotifications(res.data));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [dispatch]);

  // Clears all notifications for the logged-in user.
  const clearAllNotifications = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/notifications/clear`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch(setNotifications([])); // Clear from state instantly.
    } catch (error) {
      toast.error("Failed to clear notifications.");
      console.error("Failed to clear notifications:", error);
    }
  };

  // Fetch notifications when the component first loads.
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    // This is the main container for the notifications feed ONLY.
    <div className="w-full lg:w-[60%] border-l border-r border-neutral-800">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h1 className="font-bold text-xl">Notifications</h1>
          <div className="flex items-center space-x-4">
            {notifications && notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-blue-500 hover:underline"
              >
                Clear all
              </button>
            )}
            <IoIosSettings size="20px" className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Conditionally render a message if there are no notifications. */}
      {notifications && notifications.length === 0 ? (
        <div className="text-center p-8 mt-10">
          <h2 className="font-bold text-3xl">No new notifications</h2>
          <p className="text-neutral-500 mt-2">
            When you get new notifications, they'll show up here.
          </p>
        </div>
      ) : (
        // Map over the notifications array to display each one.
        <div>
          {notifications &&
            notifications.map((notif) => {
              // THE FIX: If fromUser is null, we skip rendering this notification.
              if (!notif.fromUser) {
                return null;
              }

              return (
                <Link
                  to={
                    notif.tweetId
                      ? `/home/tweet/${notif.tweetId}`
                      : `/home/profile/${notif.fromUser._id}`
                  }
                  key={notif._id}
                  className="block hover:bg-neutral-900/50 transition-colors duration-200"
                >
                  <div className="flex p-4 border-b border-neutral-800">
                    <div className="mr-4">
                      <NotificationIcon type={notif.type} />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center mb-2">
                        <Avatar
                          name={notif.fromUser.name}
                          size="40"
                          round={true}
                        />
                      </div>
                      <p className="text-white">
                        <span className="font-bold">{notif.fromUser.name}</span>
                        {notif.type === "like" && " liked your post."}
                        {notif.type === "follow" && " started following you."}
                        {notif.type === "comment" && " commented on your post."}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {format(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
