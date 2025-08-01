import React from "react";
import Avatar from "react-avatar";
import { FaComment, FaHeart, FaBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from 'timeago.js';
import { Link } from "react-router-dom"; // Import the Link component

const API_BASE_URL = "http://localhost:8000/api/v1";

const Tweet = ({ tweet }) => {
    const { user: loggedInUser } = useSelector(store => store.user);
    const { description, like, userId: author, createdAt, _id: tweetId } = tweet;
    
    if (!author) {
        return null;
    }

    const likeOrDislikeHandler = async () => {
        try {
            await axios.put(`${API_BASE_URL}/tweet/like/${tweetId}`, {
                id: loggedInUser?._id,
            }, {
                withCredentials: true,
            });
            toast.success("Toggled like status.");
            // A page refresh is needed to see instant UI updates for likes for now.
        } catch (error) {
            toast.error("Failed to toggle like.");
            console.error(error);
        }
    };

    return (
        <div className="flex p-4 border-b border-neutral-800">
            {/* Wrap the Avatar in a Link to the author's profile */}
            <Link to={`/home/profile/${author._id}`}>
                <Avatar name={author.name} size="40" round={true} className="cursor-pointer" />
            </Link>
            <div className="w-full px-3">
                <div className="flex items-center">
                    {/* Wrap the user's name and username in a Link */}
                    <Link to={`/home/profile/${author._id}`} className="flex items-center">
                        <h1 className="font-bold hover:underline cursor-pointer">{author.name}</h1>
                        <p className="px-2 text-neutral-500 hover:underline cursor-pointer">@{author.username}</p>
                    </Link>
                    <p className="text-neutral-600">·</p>
                    <p className="ml-1 text-neutral-500 hover:underline cursor-pointer">{format(createdAt)}</p>
                </div>

                <div className="py-2">
                    <p>{description}</p>
                </div>

                <div className="flex justify-between my-3 text-neutral-500">
                    <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
                        <FaComment size="18px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                    <div className="flex items-center duration-200 cursor-pointer hover:text-green-500">
                        <BiRepost size="24px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                    <div 
                        onClick={likeOrDislikeHandler}
                        className="flex items-center duration-200 cursor-pointer hover:text-pink-600"
                    >
                        <FaHeart size="18px" className={like.includes(loggedInUser?._id) ? "text-pink-600" : ""} />
                        <p className="ml-2 text-sm">{like.length}</p>
                    </div>
                    <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
                        <FaBookmark size="18px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweet;
