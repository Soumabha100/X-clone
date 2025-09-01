// frontend/src/components/TweetPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Tweet from "./Tweet"; // We'll reuse our Tweet component!
import TweetSkeleton from "./TweetSkeleton";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_BASE_URL = "/api/v1";

const TweetPage = () => {
  const [tweet, setTweet] = useState(null);
  const { id } = useParams(); // Get the tweet ID from the URL

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/tweet/${id}`, {
          withCredentials: true,
        });
        setTweet(res.data);
      } catch (error) {
        console.error("Failed to fetch tweet:", error);
      }
    };
    fetchTweet();
  }, [id]);

  return (
    <div className="w-full lg:w-[60%] border-l border-r border-neutral-800">
      {/* --- Header --- */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center p-2 border-b border-neutral-800">
          <Link
            to="/home"
            className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
          >
            <IoMdArrowRoundBack size="24px" />
          </Link>
          <h1 className="font-bold text-xl ml-4">Post</h1>
        </div>
      </div>

      {/* --- Tweet Display --- */}
      <div>{!tweet ? <TweetSkeleton /> : <Tweet tweet={tweet} />}</div>
    </div>
  );
};

export default TweetPage;
