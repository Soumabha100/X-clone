import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetProfile from "../hooks/useGetProfile";

const Home = () => {
    const { user, isLoading } = useSelector(store => store.user);
    const navigate = useNavigate();

    useGetProfile();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [isLoading, user, navigate]);

    if (isLoading || !user) {
        // Show a loading screen or return null to wait for redirect
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <h1 className="text-xl font-bold">Loading...</h1>
            </div>
        );
    }
    
    return (
        // This is the simplified flex container for the whole page layout.
        <div className="flex justify-center w-full sm:max-w-6xl sm:mx-auto">
            <Sidebar />
            <Outlet />
            <Widgets />
        </div>
    );
};

export default Home;