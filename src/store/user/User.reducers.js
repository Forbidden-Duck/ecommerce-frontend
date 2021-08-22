import { createSlice } from "@reduxjs/toolkit";
import * as userActions from "./User.actions";
import { loginUser, refreshUserToken } from "../auth/Auth.actions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isPending: false,
        error: null,
        fetchedUser: null,
        userCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login success
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.userCache[user._id] = user;
            })
            // Refresh token success
            .addCase(refreshUserToken.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.userCache[user._id] = user;
            })

            // Clear user error
            .addCase(userActions.clearUserError, (state) => {
                state.error = null;
            })

            /// Get user from cache
            .addCase(userActions.getUserFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    state.fetchedUser = state.userCache[action.payload] || null;
                }
            })
            // Delete user from cache
            .addCase(userActions.deleteUserFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    delete state.userCache[action.payload];
                }
            })

            // Get users pending
            .addCase(userActions.getUsers.pending, (state, action) => {
                state.isPending = true;
            })
            // Get users success
            .addCase(userActions.getUsers.fulfilled, (state, action) => {
                const { users } = action.payload;
                state.isPending = false;
                state.error = null;
                for (const user of users) {
                    state.userCache[user._id] = user;
                }
            })
            // Get users failure
            .addCase(userActions.getUsers.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get user pending
            .addCase(userActions.getUser.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Get user success
            .addCase(userActions.getUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.isPending = false;
                state.userCache[user._id] = user;
                state.error = null;
            })
            // Get user failure
            .addCase(userActions.getUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Update user pending
            .addCase(userActions.updateUser.pending, (state) => {
                state.isPending = true;
                state.error = null;
            })
            // Update user success
            .addCase(userActions.updateUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.userCache[user._id] = user;
                state.isPending = false;
                state.error = null;
            })
            // Update user failure
            .addCase(userActions.updateUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Delete user pending
            .addCase(userActions.deleteUser.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Delete user success
            .addCase(userActions.deleteUser.fulfilled, (state, action) => {
                const { userid } = action.payload;
                delete state.userCache[userid];
                state.isPending = false;
                state.error = null;
            })
            // Delete user failure
            .addCase(userActions.deleteUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default userSlice.reducer;
