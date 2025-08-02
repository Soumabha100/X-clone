import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null, // Holds the logged-in user's data
    },
    reducers: {
        // Action to set the user data upon login
        setUser: (state, action) => {
            state.user = action.payload;
        },
        // Action to clear user data upon logout
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
