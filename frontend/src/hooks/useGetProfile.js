import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "/api/v1";

const useGetProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
        });
        // If the cookie is valid, the server returns the user.
        // We dispatch this user to the Redux store.
        dispatch(setUser(res.data.user));
      } catch (error) {
        // If the cookie is invalid or expired, the API call will fail.
        // We dispatch `null` to confirm the user is not logged in.
        dispatch(setUser(null));
        console.error("Could not fetch user profile:", error);
      }
    };

    // We run this check once when the app loads.
    fetchUser();
    
  }, [dispatch]); // The effect runs only once on mount.
};

export default useGetProfile;