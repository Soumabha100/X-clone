import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetProfile from "../hooks/useGetProfile";

/**
 * The Home component serves as the main layout for the authenticated part of the application.
 * It establishes the three-column structure (Sidebar, Main Content, Widgets) and
 * acts as a protected route, redirecting any unauthenticated users to the login page.
 */
const Home = () => {
    // Get the current user and the loading status from the Redux store.
    const { user, isLoading } = useSelector(store => store.user);
    const navigate = useNavigate();

    // This custom hook is called on component mount. It attempts to fetch the user's
    // profile using the auth cookie, which is crucial for persisting the session on page refresh.
    useGetProfile();

    // This effect is responsible for protecting the route.
    useEffect(() => {
        // We wait until the initial authentication check (from useGetProfile) is complete.
        if (!isLoading) {
            // If the check is done and there is still no user, redirect to the login page.
            if (!user) {
                navigate("/login");
            }
        }
        // This comment disables a linter warning. We intentionally omit 'user' from the
        // dependency array to prevent a redirect loop during the initial loading phase.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, navigate]);

    // While the initial authentication check is in progress, display a loading screen.
    // This prevents a "flash" of the login page for authenticated users on refresh.
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <h1 className="text-xl font-bold">Loading...</h1>
            </div>
        );
    }

    // If the loading is complete but there's no user, the effect above will have already
    // initiated a redirect. Returning null prevents a brief flash of the component.
    if (!user) {
        return null; 
    }

    // If loading is complete and a user exists, render the main application layout.
    return (
        <div className="flex justify-between w-full max-w-6xl mx-auto">
            <Sidebar />
            {/* The <Outlet /> component from react-router-dom renders the appropriate
                child component (e.g., Feed, Profile) based on the current URL. */}
            <Outlet />
            <Widgets />
        </div>
    );
};

export default Home;
