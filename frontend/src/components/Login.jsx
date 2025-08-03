import React, { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Array of dynamic messages to display during loading
const loadingMessages = [
  "Authenticating...",
  "Checking credentials...",
  "Hold on tight...",
  "Almost there...",
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");

  // This state controls the full-screen loading overlay
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Effect to cycle through the loading messages
  useEffect(() => {
    let interval;
    if (isLoading) {
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000); // Change message every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activate the full-screen loading overlay
    setLoadingMessage(loadingMessages[0]); // Reset to the first message

    if (isLogin) {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/login`,
          { identifier, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        // The overlay will remain visible until the new page loads.
        // We do NOT turn off loading on success, which is the key to fixing the flash.
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
        setIsLoading(false); // Only turn off loading on error
      }
    } else {
      // Register logic
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/register`,
          { name, username, email, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        toast.success(res.data.message);
        setIsLogin(true);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    // Clear form fields
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setIdentifier("");
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen py-12 bg-black text-white">
      <Toaster />

      {/* --- Full-Screen Loading Overlay with Smooth Transition --- */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Spinning X Logo */}
        <div className="animate-spin">
          <FaXTwitter size={60} />
        </div>
        <p className="mt-6 text-xl font-semibold tracking-wider">
          {loadingMessage}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-evenly w-[90%] lg:w-[80%] max-w-6xl">
        <div className="mb-12 lg:mb-0">
          <FaXTwitter size={300} />
        </div>
        <div className="w-full lg:w-1/2 max-w-md">
          <h1 className="mb-4 text-6xl font-bold">
            {isLogin ? "Sign in" : "Happening now"}
          </h1>
          <h2 className="mb-8 text-3xl font-bold">
            {isLogin ? "to your account" : "Join today."}
          </h2>
          <form className="flex flex-col" onSubmit={formSubmitHandler}>
            {isLogin ? (
              <>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </>
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className={`px-4 py-3 my-4 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLogin ? "Sign in" : "Create Account"}
            </button>
          </form>
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
