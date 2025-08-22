import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Explore from "./Explore";
import Bookmarks from "./Bookmarks";
import Premium from "./Premium";
import Login from "./Login";
import LoadingOverlay from "./LoadingOverlay";
import TweetPage from "./TweetPage";
/**
 * The Body component is the core of the application's routing.
 * It uses react-router-dom to define all possible URL paths and
 * which component should be rendered for each path.
 */
// Update 1
const Body = () => {
  // createBrowserRouter defines the application's route configuration.
  const appRouter = createBrowserRouter([
    {
      // The root path ('/') is the default entry point for the website.
      // It renders the Login component for any new or unauthenticated visitor.
      path: "/",
      element: <Login />,
    },
    {
      // The '/home' path is the main application layout for authenticated users.
      // It renders the Home component, which contains the Sidebar, Widgets, and an Outlet.
      path: "/home",
      element: <Home />,
      // 'children' defines the nested routes that will be rendered inside the Home component's <Outlet />.
      children: [
        {
          // 'index: true' makes the Feed component the default child to render at '/home'.
          index: true,
          element: <Feed />,
        },
        {
          // This route handles user profiles. The ':id' is a dynamic parameter
          // that will match any user ID, e.g., '/home/profile/12345'.
          path: "profile/:id",
          element: <Profile />,
        },
        {
          // Route for the notifications page, e.g., '/home/notifications'.
          path: "notifications",
          element: <Notifications />,
        },
        {
          // Route for the explore page, e.g., '/home/explore'.
          path: "explore",
          element: <Explore />,
        },
        {
          path: "tweet/:id",
          element: <TweetPage />,
        },
        {
          // Route for the bookmarks page, e.g., '/home/bookmarks'.
          path: "bookmarks",
          element: <Bookmarks />,
        },
      ],
    },
    {
      // An explicit route for the login page.
      path: "/login",
      element: <Login />,
    },
    {
      // A top-level route for the premium subscription page.
      path: "/premium",
      element: <Premium />,
    },
  ]);

  return (
    <div>
      {/* The LoadingOverlay is placed here, outside the RouterProvider, so it can
        render on top of any page in the application. Its visibility is controlled
        globally by the Redux store.
      */}
      <LoadingOverlay />
      {/* The RouterProvider component takes the router configuration and enables
        all the routing functionality for the application.
      */}
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
