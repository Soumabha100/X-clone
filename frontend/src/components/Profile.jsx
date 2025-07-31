import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

const Profile = () => {
  return (
    <div className="w-[50%] border-l border-r border-black">
      <div>
        <div className="flex items-center py-2">
          <Link to="/" className="p-2 rounded-full cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
            <IoMdArrowRoundBack size="24px" />
          </Link>
          <div className="ml-4">
            <h1 className="font-bold text-lg">Tamalika Das</h1>
            <p className="text-neutral-500 ">20 posts</p>
          </div>
        </div>
        <img 
          src="https://www.avalara.com/content/dam/assets/banners-and-backrounds/technology-partner-1.png"
          alt="banner"
          
        />
        <div className
          ='absolute top-64 border-5 border-black rounded-full ml-2'>

           <Avatar src="https://w0.peakpx.com/wallpaper/672/902/HD-wallpaper-hide-face-girl-with-sunflower-hide-face-girl.jpg"
                size="150"
                round={true}
                />
        </div>
        <div className="text-right m-4 ">
          <button className="px-4 py-1 rounded-full hover:bg-blue-400 bg-amber-700 font-bold border-gray-600">Edit Profile</button>
        </div>
        <div className=" m-4">
          <h1 className="text-xl font-extrabold ">Tamalika Das</h1>
          <p>tamalika05@gmail.com</p>
        </div>
        <div className="m-4 ">
          <p>
            Full Stack Developer Mern✈️ || Problem solver by day, coder by night👩‍💻 || Coffee lover🍵||Join us with Code🖥️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
