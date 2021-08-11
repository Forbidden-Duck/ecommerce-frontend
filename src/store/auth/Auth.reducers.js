import { createSlice } from "@reduxjs/toolkit";
import * as authActions from "./Auth.actions";
import { deleteUser } from "../user/User.actions";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isPending: false,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
        refreshError: null,
        jwt: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Delete user success
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.error = null;
                state.jwt = null;
            })

            // Clear error state
            .addCase(authActions.clearError, (state) => {
                state.error = null;
            })

            // Register pending
            .addCase(authActions.registerUser.pending, (state, action) => {
                state.isPending = true;
            })
            // Register success
            .addCase(authActions.registerUser.fulfilled, (state, action) => {
                state.isPending = false;
                state.error = null;
            })
            // Register failure
            .addCase(authActions.registerUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Login pending
            .addCase(authActions.loginUser.pending, (state, action) => {
                state.isPending = true;
            })
            // Login success
            .addCase(authActions.loginUser.fulfilled, (state, action) => {
                const { jwt, admin } = action.payload;
                state.isPending = false;
                state.isAuthenticated = true;
                state.isAdmin = admin;
                state.jwt = jwt;
                state.error = null;
            })
            // Login failure
            .addCase(authActions.loginUser.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.isAdmin = false;
                state.error = message;
            })

            // Refresh token pending
            .addCase(authActions.refreshUserToken.pending, (state, action) => {
                state.isPending = true;
            })
            // Refresh token success
            .addCase(
                authActions.refreshUserToken.fulfilled,
                (state, action) => {
                    const { jwt, admin } = action.payload;
                    state.isAuthenticated = true;
                    state.isAdmin = admin;
                    state.jwt = jwt;
                    state.refreshError = null;
                    state.isPending = false;
                }
            )
            // Refresh token failed
            .addCase(authActions.refreshUserToken.rejected, (state, action) => {
                const { message } = action.error;
                state.isAuthenticated = false;
                state.jwt = null;
                state.isAdmin = false;
                state.refreshError = message;
                state.isPending = false;
            })

            // Logout pending
            .addCase(authActions.logoutUser.pending, (state, action) => {
                state.isPending = true;
            })
            // Logout success
            .addCase(authActions.logoutUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.isAdmin = false;
                state.jwt = null;
                state.error = null;
                state.isPending = false;
            })
            // Logout failure
            .addCase(authActions.logoutUser.rejected, (state, action) => {
                const { message } = action.error;
                state.error = message;
                state.isPending = false;
            });
    },
});

export default authSlice.reducer;
