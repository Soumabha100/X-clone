// In frontend/src/hooks/useGetProfile.js
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // <-- Import useSelector
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "https://x-clone-api-soumabha.onrender.com/api/v1";

const useGetProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user); // <-- Get user from Redux store

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(setUser(null));
        console.error("Could not fetch user profile:", error);
      }
    };

    // THE FIX: Only run the fetch function if there is no user in the Redux state.
    if (!user) {
      fetchUser();
    }
  }, [dispatch, user]); // <-- Add user to the dependency array
};

export default useGetProfile;
