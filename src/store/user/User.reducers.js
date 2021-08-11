import { createSlice } from "@reduxjs/toolkit";
import * as userActions from "./User.actions";
import { loginUser, refreshUserToken, logoutUser } from "../auth/Auth.actions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isFetching: false,
        error: null,
        authenticatedUser: null,
        userCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login success
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.authenticatedUser = user;
            })
            // Refresh token success
            .addCase(refreshUserToken.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.authenticatedUser = user;
            })
            // Logout success
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.authenticatedUser = null;
            })

            // Clear user error
            .addCase(userActions.clearUserError, (state) => {
                state.error = null;
            })

            // Get users pending
            .addCase(userActions.getUsers.pending, (state, action) => {
                state.isFetching = true;
            })
            // Get users success
            .addCase(userActions.getUsers.fulfilled, (state, action) => {
                const { users } = action.payload;
                state.isFetching = false;
                state.error = null;
                for (const user of users) {
                    state.userCache[user._id] = user;
                }
            })
            // Get users failure
            .addCase(userActions.getUsers.rejected, (state, action) => {
                const { message } = action.error;
                state.isFetching = false;
                state.error = message;
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
                state.userCache[user._id] = user;
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
                state.userCache[user._id] = user;
                state.error = null;
            })
            // Update user failure
            .addCase(userActions.updateUser.rejected, (state, action) => {
                const { message } = action.error;
                state.error = message;
            })

            // Delete user success
            .addCase(userActions.deleteUser.fulfilled, (state, action) => {
                const { userid } = action.payload;
                delete state.userCache[userid];
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
