import React, { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

// An array of engaging messages to display during the authentication process.
const loadingMessages = [
  "Authenticating...",
  "Checking credentials...",
  "Hold on tight...",
  "Almost there...",
];

/**
 * The Login component handles both user registration and sign-in.
 * It features a toggleable form and a polished, full-screen loading animation
 * to provide a smooth user experience during authentication.
 */
const Login = () => {
  // State to toggle between the Login and Register form views.
  const [isLogin, setIsLogin] = useState(true);

  // State for the various form input fields.
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState(""); // Used for either email or username during login.

  // State to control the visibility of the full-screen loading overlay.
  const [isLoading, setIsLoading] = useState(false);
  // State to manage the currently displayed dynamic loading message.
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // This effect cycles through the 'loadingMessages' array when isLoading is true.
  useEffect(() => {
    let interval;
    if (isLoading) {
      let messageIndex = 0;
      interval = setInterval(() => {
        // Loop through the messages array.
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000); // Change the message every 2 seconds.
    }
    // Cleanup function to clear the interval when the component unmounts or isLoading becomes false.
    return () => clearInterval(interval);
  }, [isLoading]);

  /**
   * Toggles the view between the login and registration forms.
   */
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  /**
   * Handles the form submission for both login and registration.
   */
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activate the full-screen loading overlay.
    setLoadingMessage(loadingMessages[0]); // Reset to the first message.

    if (isLogin) {
      // --- LOGIN LOGIC ---
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/login`,
          { identifier, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        // On success, dispatch the user data to the Redux store.
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        // We use a timeout to allow the user to see the success toast.
        // The loading overlay remains active during this time to prevent any "flash"
        // of the login screen before the redirect is complete.
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
        setIsLoading(false); // Turn off the loading overlay only on error.
      }
    } else {
      // --- REGISTER LOGIC ---
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/register`,
          { name, username, email, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        // On success, dispatch user data to Redux to log them in
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // Redirect to the home page after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
        setIsLoading(false); // Stop loading on error
      }
    }
    // Clear all form fields after submission.
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setIdentifier("");
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen py-12 bg-black text-white">
      <Toaster />

      {/* --- Full-Screen Loading Overlay --- */}
      {/* This overlay provides a seamless transition during API calls. */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* A spinning 'X' logo for a modern loading animation. */}
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
              // Login-specific input field.
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
              // Registration-specific input fields.
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
            {/* The password field is common to both forms. */}
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
          {/* Link to toggle between Login and Register views. */}
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
