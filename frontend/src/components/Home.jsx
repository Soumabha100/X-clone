import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetProfile from "../hooks/useGetProfile"; // Import the custom hook

const Home = () => {
    // Get the user from the Redux store
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();

    // Call our custom hook to fetch the user profile on component mount
    useGetProfile();

    // Effect to check for user and redirect if not authenticated
    useEffect(() => {
        // If there is no user, redirect to the login page
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]); // This effect runs whenever the user state changes

    // A safeguard to prevent rendering children before user data is available
    // or before the redirect happens.
    if (!user) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex justify-between w-full max-w-6xl mx-auto">
            <Sidebar />
            <Outlet />
            <Widgets />
        </div>
    );
};

export default Home;
