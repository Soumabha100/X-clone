    import { createSlice } from "@reduxjs/toolkit";

    const userSlice = createSlice({
        name: "user",
        initialState: {
            user: null,
            // Add a loading state to track the initial auth check. Default to true.
            isLoading: true, 
        },
        reducers: {
            // When we set a user, we know loading is done.
            setUser: (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            },
            // When we clear the user (logout), loading is also done.
            clearUser: (state) => {
                state.user = null;
                state.isLoading = false;
            },
        },
    });

    export const { setUser, clearUser } = userSlice.actions;
    export default userSlice.reducer;
    