import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Explore from "./Explore";
import Premium from "./Premium";
import Login from "./Login";

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
          element: <Feed />,
        },
        {
          path: "profile/:id", 
          element: <Profile />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/premium",
      element: <Premium />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
