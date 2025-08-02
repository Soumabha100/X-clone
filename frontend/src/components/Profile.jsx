import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Profile = () => {
    // State to hold the profile data we fetch
    const [profile, setProfile] = useState(null);
    
    // Get the logged-in user's data from Redux store
    const { user: loggedInUser } = useSelector(store => store.user);
    
    // Get the user ID from the URL parameters
    const { id } = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/user/profile/${id}`, {
                    withCredentials: true,
                });
                setProfile(res.data.user);
            } catch (error) {
                toast.error("Failed to fetch profile.");
                console.error("Fetch profile error:", error);
            }
        };

        fetchUserProfile();
    }, [id]); // Re-run the effect if the ID in the URL changes

    // Show a loading state while fetching data
    if (!profile) {
        return <div className="w-[50%] text-center p-8"><h1>Loading profile...</h1></div>;
    }

    return (
        <div className="w-full md:w-[50%] border-l border-r border-gray-800">
            <div>
                <div className="flex items-center py-2 px-2">
                    <Link to="/home" className="p-2 rounded-full cursor-pointer hover:bg-neutral-800">
                        <IoMdArrowRoundBack size="24px" />
                    </Link>
                    <div className="ml-4">
                        <h1 className="font-bold text-lg">{profile.name}</h1>
                        <p className="text-neutral-500 text-sm">0 posts</p> {/* This can be made dynamic later */}
                    </div>
                </div>
                <img
                    src="https://www.avalara.com/content/dam/assets/banners-and-backrounds/technology-partner-1.png"
                    alt="banner"
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-52 ml-4">
                    <Avatar
                        src="https://w0.peakpx.com/wallpaper/672/902/HD-wallpaper-hide-face-girl-with-sunflower-hide-face-girl.jpg" // This can also be dynamic
                        size="140"
                        round={true}
                        className="border-4 border-black"
                    />
                </div>
                <div className="text-right m-4 pt-16">
                    {/* Only show Edit Profile button if viewing your own profile */}
                    {loggedInUser?._id === profile._id && (
                        <button className="px-4 py-1.5 rounded-full hover:bg-gray-700 bg-transparent font-bold border border-gray-500">
                            Edit Profile
                        </button>
                    )}
                </div>
                <div className="m-4">
                    <h1 className="text-xl font-extrabold">{profile.name}</h1>
                    <p className="text-neutral-500">@{profile.username}</p>
                </div>
                <div className="m-4">
                    <p>
                        Full Stack Developer Mern✈️ || Problem solver by day, coder by night👩‍💻 || Coffee lover🍵||Join us with Code🖥️
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
