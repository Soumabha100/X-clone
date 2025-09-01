import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = "/api/v1";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Sending reset request...");

    try {
      const res = await axios.post(`${API_BASE_URL}/user/forgot-password`, {
        email,
      });
      toast.success("Reset token is in server logs. Redirecting...", {
        id: toastId,
      });

      // In a real app, you wouldn't get the token back here.
      // For this project, we navigate to the reset page with the token.
      setTimeout(() => {
        navigate(`/reset-password/${res.data.resetToken}`);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.", {
        id: toastId,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Toaster />
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-900 rounded-lg shadow-lg">
        <div className="text-center">
          <FaXTwitter size={40} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-neutral-400">
            Enter your email to receive a reset token.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
