import { createSlice } from "@reduxjs/toolkit";
import * as userActions from "./User.actions";
import {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
} from "../auth/Auth.actions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isFetching: false,
        error: null,
        userid: null,
        user: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register success
            .addCase(registerUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.user = user;
            })
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
            // Logout success
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.userid = null;
            })

            // Clear user error
            .addCase(userActions.clearUserError, (state) => {
                state.error = null;
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
                state.error = null;
            })
            // Get user failure
            .addCase(userActions.getUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isFetching = false;
                state.error = message;
            })

            // Update user success
            .addCase(userActions.updateUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.user = user;
                state.error = null;
            })
            // Update user failure
            .addCase(userActions.updateUser.rejected, (state, action) => {
                const { message } = action.error;
                state.error = message;
            })

            // Delete user success
            .addCase(userActions.deleteUser.fulfilled, (state, action) => {
                state.user = null;
                state.error = null;
            })
            // Delete user failure
            .addCase(userActions.deleteUser.rejected, (state, action) => {
                const { message } = action.error;
                state.error = message;
            });
    },
});

export default userSlice.reducer;
