import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * A custom React hook responsible for fetching the logged-in user's profile
 * when a component mounts. This is the key to persisting the user session
 * across page refreshes.
 */
const useGetProfile = () => {
  const dispatch = useDispatch();

  // The useEffect hook runs once when a component that uses this hook is mounted.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make an API call to the '/me' endpoint, sending the auth cookie.
        const res = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
        });
        // If the request is successful, dispatch the user data to the Redux store.
        // This repopulates the user state for the application.
        dispatch(setUser(res.data.user));
      } catch (error) {
        // If the request fails (e.g., invalid or expired cookie),
        // we dispatch null to the user state, ensuring the user is logged out.
        dispatch(setUser(null));
        console.error("Could not fetch user profile:", error);
      }
    };
    fetchUser();
  }, [dispatch]); // The dependency array ensures this effect runs only once on mount.
};

export default useGetProfile;
