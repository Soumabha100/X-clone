import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Explore from "./Explore";
import Premium from "./Premium";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
         index:true,
          element: <Feed />,
        },
        { path: "/profile",
            element:<Profile/>
         },
         { path: "/notifications",
            element:<Notifications/>
         },
         { path: "/explore",
            element:<Explore/>
         },
         { path: "/premium",
            element:<Premium/>
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
