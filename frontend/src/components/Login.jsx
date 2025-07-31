import React from "react";
import { FaXTwitter } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex items-center ">
        <div>
          <FaXTwitter size={64} />
         </div>
        <div>
          <div>
          </div>
          <h1>Login</h1>
          <form className="flex flex-col" action="">
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
