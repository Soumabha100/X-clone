import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import LoadingOverlay from "./LoadingOverlay";
import TweetSkeleton from "./TweetSkeleton";
import ForgotPassword from "./ForgotPassword"; 
import ResetPassword from "./ResetPassword"; 

// Lazy load the components
const Feed = lazy(() => import("./Feed"));
const Profile = lazy(() => import("./Profile"));
const Notifications = lazy(() => import("./Notifications"));
const Explore = lazy(() => import("./Explore"));
const Bookmarks = lazy(() => import("./Bookmarks"));
const Premium = lazy(() => import("./Premium"));
const TweetPage = lazy(() => import("./TweetPage"));

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <Feed />
            </Suspense>
          ),
        },
        {
          path: "profile/:id",
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <Notifications />
            </Suspense>
          ),
        },
        {
          path: "explore",
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <Explore />
            </Suspense>
          ),
        },
        {
          path: "tweet/:id",
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <TweetPage />
            </Suspense>
          ),
        },
        {
          path: "bookmarks",
          element: (
            <Suspense fallback={<TweetSkeleton />}>
              <Bookmarks />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/premium",
      element: (
        <Suspense fallback={<p>Loading...</p>}>
          <Premium />
        </Suspense>
      ),
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
  ]);

  return (
    <div>
      <LoadingOverlay />
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
