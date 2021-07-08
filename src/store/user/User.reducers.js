import { createSlice } from "@reduxjs/toolkit";
import * as userActions from "./User.actions";
import { loginUser, refreshUserToken } from "../auth/Auth.actions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isFetching: false,
        error: null,
        userid: null,
        user: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // Login success
            .addCase(loginUser.fulfilled, (state, action) => {
                const { userid } = action.payload;
                state.userid = userid;
            })
            // Refresh token success
            .addCase(refreshUserToken.fulfilled, (state, action) => {
                const { userid } = action.payload;
                state.userid = userid;
            })

            // Get user pending
            .addCase(userActions.getUser.pending, (state, action) => {
                state.isFetching = true;
                state.error = null;
            })
            // Get user success
            .addCase(userActions.getUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.isFetching = false;
                state.user = user;
            })
            // Get user failure
            .addCase(userActions.getUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.isFetching = false;
                state.error = error;
            })

            // Update user success
            .addCase(userActions.updateUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.user = user;
                state.error = null;
            })
            // Update user failure
            .addCase(userActions.updateUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.error = error;
            })

            // Delete user success
            .addCase(userActions.deleteUser.fulfilled, (state, action) => {
                state.userid = null;
                state.user = null;
                state.error = null;
            })
            // Delete user failure
            .addCase(userActions.deleteUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.error = error;
            });
    }
});

export default userSlice.reducer;