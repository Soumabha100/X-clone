import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = "/api/v1";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      await axios.post(`${API_BASE_URL}/user/reset-password/${token}`, {
        password,
      });
      toast.success("Password reset successfully! Redirecting to login...", {
        id: toastId,
      });

      setTimeout(() => {
        navigate("/login");
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
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-neutral-400">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Saving..." : "Reset Password"}
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

export default ResetPassword;
