import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const API_BASE_URL = "http://localhost:8000/api/v1";

const useGetProfile = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/user/me`, {
                    withCredentials: true,
                });
                dispatch(setUser(res.data.user));
            } catch (error) {
                // If there's an error (e.g., no valid cookie), set the user to null.
                dispatch(setUser(null));
                // Now we are using the 'error' variable for better logging.
                console.error("Could not fetch user profile:", error);
            }
        };
        fetchUser();
    }, [dispatch]);
};

export default useGetProfile;
