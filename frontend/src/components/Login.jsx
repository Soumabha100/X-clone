import React from "react";
import { FaXTwitter } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="bg-black text-white w-screen h-screen flex items-center justify-center overflow-hidden">
      <div className="flex items-center justify-evenly w-[80%]">
        
        {/* Left Side: Logo */}
        <div>
          <FaXTwitter size={300} />
        </div>

        {/* Right Side: Entire form column */}
        <div className="w-[45%]">
          {/* Headings */}
          <h1 className="font-bold text-6xl mb-4">Happening now</h1>
          <h2 className="font-bold text-3xl mb-8">Join today.</h2>

          {/* Form */}
          <form className="flex flex-col" action="">
            <input
              type="text"
              placeholder="Name"
              className="bg-transparent border border-gray-700 my-2 py-3 px-4 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Username"
              className="bg-transparent border border-gray-700 my-2 py-3 px-4 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border border-gray-700 my-2 py-3 px-4 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent border border-gray-700 my-2 py-3 px-4 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="bg-blue-500 text-lg font-bold py-3 px-4 my-4 rounded-full hover:bg-blue-600 transition-colors">
              Create Account
            </button>
          </form>

          {/* "Already have an account?" Section */}
          <div className="mt-6">
            <h3 className="font-bold mb-4">Already have an account?</h3>
            <button className="w-full border border-gray-500 text-blue-500 text-lg font-bold py-3 px-4 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
              Sign in
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;