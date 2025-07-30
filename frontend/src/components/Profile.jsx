import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="w-{50%}">
      <div>
        <div className="flex items-center py-2">
          <Link to="/" className="p-2 rounded-full cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
            <IoMdArrowRoundBack size="24px" />
          </Link>
          <div className="pl-2">
            <h1 className="font-bold text-lg">Elon Musk</h1>
            <p className="text-neutral-500 ">2 posts</p>
          </div>
        </div>
        <img
          src="https://pbs.twimg.com/profile_images/2699429079/9dd1006a662c15d0387ddf883027bf54_400x400.jpeg"
          alt="banner"
        />
      </div>
    </div>
  );
};

export default Profile;
