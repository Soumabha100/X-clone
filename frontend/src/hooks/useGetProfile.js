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
                // Dispatch the user data to the Redux store
                dispatch(setUser(res.data.user));
            } catch (error) {
                // This can happen if the cookie is invalid or expired
                console.log("Could not fetch user profile:", error);
            }
        };
        fetchUser();
    }, [dispatch]);
};

export default useGetProfile;
