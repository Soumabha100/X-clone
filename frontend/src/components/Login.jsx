import React, { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleForm = () => { setIsLogin(!isLogin); };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const res = await axios.post(`${API_BASE_URL}/user/login`, { email, password }, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        // Dispatch the user data to the Redux store
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setTimeout(() => { navigate("/home"); }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE_URL}/user/register`, { name, username, email, password }, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        toast.success(res.data.message);
        setIsLogin(true);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    }
    setName(""); setUsername(""); setEmail(""); setPassword("");
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-12">
      <Toaster />
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-[90%] lg:w-[80%] max-w-6xl">
        <div className="mb-12 lg:mb-0"><FaXTwitter size={300} /></div>
        <div className="w-full lg:w-1/2 max-w-md">
          <h1 className="mb-4 text-6xl font-bold">{isLogin ? "Sign in" : "Happening now"}</h1>
          <h2 className="mb-8 text-3xl font-bold">{isLogin ? "to your account" : "Join today."}</h2>
          <form className="flex flex-col" onSubmit={formSubmitHandler}>
            {!isLogin && (
              <>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500" required />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500" required />
              </>
            )}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-3 my-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500" required />
            <button type="submit" className="px-4 py-3 my-4 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600">{isLogin ? "Sign in" : "Create Account"}</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-neutral-400">{isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={toggleForm} className="font-bold text-blue-500 cursor-pointer hover:underline">{isLogin ? "Create one" : "Sign in"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
