import React, { useState, useEffect } from "react";
import Post from "./Post";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTweets } from "../redux/tweetSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Feed = () => {
    const [activeTab, setActiveTab] = useState("For you");
    const { user } = useSelector(store => store.user);
    const { tweets } = useSelector(store => store.tweet);
    const dispatch = useDispatch();

    // Fetch tweets when the component mounts or when the user changes
    useEffect(() => {
        const fetchTweets = async () => {
            if (user?._id) {
                try {
                    const res = await axios.get(`${API_BASE_URL}/tweet/alltweets/${user._id}`, {
                        withCredentials: true,
                    });
                    dispatch(setTweets(res.data.tweets));
                } catch (error) {
                    console.error("Failed to fetch tweets:", error);
                }
            }
        };
        fetchTweets();
    }, [user, dispatch]);

    return (
        <div className="w-full border-l border-r lg:w-[60%] border-neutral-700">
            {/* --- Sticky Header with Tabs --- */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-neutral-700">
                    <div
                        onClick={() => setActiveTab("For you")}
                        className="w-full text-center cursor-pointer hover:bg-neutral-900"
                    >
                        <h1 className={`py-4 font-semibold text-lg relative ${activeTab === "For you" ? "text-white" : "text-neutral-500"}`}>
                            For you
                            {activeTab === "For you" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>}
                        </h1>
                    </div>
                    <div
                        onClick={() => setActiveTab("Following")}
                        className="w-full text-center cursor-pointer hover:bg-neutral-900"
                    >
                        <h1 className={`py-4 font-semibold text-lg relative ${activeTab === "Following" ? "text-white" : "text-neutral-500"}`}>
                            Following
                            {activeTab === "Following" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>}
                        </h1>
                    </div>
                </div>
            </div>

            {/* --- Post Creation Component --- */}
            <Post />

            {/* --- List of Tweets --- */}
            {/* We now map over the tweets from the Redux store */}
            {tweets?.map((tweet) => (
                <Tweet key={tweet._id} tweet={tweet} />
            ))}
        </div>
    );
};

export default Feed;
