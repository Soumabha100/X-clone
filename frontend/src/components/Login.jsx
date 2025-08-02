import React, { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

const Login = () => {
  // State to toggle between Login and Register views. true = Login, false = Register.
  const [isLogin, setIsLogin] = useState(true);

  // Handler to switch between login and register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-12 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-[90%] lg:w-[80%] max-w-6xl">
        
        {/* Left Side: Logo */}
        <div className="mb-12 lg:mb-0">
          <FaXTwitter size={300} />
        </div>

        {/* Right Side: Entire form column */}
        <div className="w-full lg:w-1/2 max-w-md">
          {/* Headings - Change based on isLogin state */}
          <h1 className="mb-4 text-6xl font-bold">
            {isLogin ? "Sign in" : "Happening now"}
          </h1>
          <h2 className="mb-8 text-3xl font-bold">
            {isLogin ? "to your account" : "Join today."}
          </h2>

          {/* Form */}
          <form className="flex flex-col" action="">
            {/* Conditional fields for Register view */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                />
              </>
            )}

            {/* Fields for both Login and Register */}
            <input
              type="text"
              placeholder="Username"
              className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />

            {/* Button text changes based on isLogin state */}
            <button className="px-4 py-3 my-4 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
              {isLogin ? "Sign in" : "Create Account"}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center">
            <p className="text-neutral-400">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                onClick={toggleForm}
                className="font-bold text-blue-500 cursor-pointer hover:underline"
              >
                {isLogin ? "Create one" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
