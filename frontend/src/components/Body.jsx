import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import Notifications from "./Notifications";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Feed />,
        },
        { path: "/profile",
            element:<Profile/>
         },
         { path: "/notifications",
            element:<Notifications/>
         },
      ],
    },
  ]);
  return (
    <div>
      <div>
        {" "}
        <RouterProvider router={appRouter} />
      </div>
    </div>
  );
};

export default Body;
