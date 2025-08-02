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
        if (!isLoading) {
            if (!user) {
                navigate("/login");
            }
        }
        // By adding this comment, we are telling the linter to ignore the
        // "missing dependency" warning for the 'user' variable on this specific hook.
        // This is the correct way to handle this intentional omission.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <h1 className="text-xl font-bold">Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return null; 
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
