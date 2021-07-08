import { createSlice } from "@reduxjs/toolkit";
import * as authActions from "./Auth.actions";
import { deleteUser } from "../user/User.actions";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isPending: false,
        isAuthenticated: false,
        error: null,
        jwt: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // Delete user success
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.error = null;
                state.jwt = null;
            })

            // Register pending
            .addCase(authActions.registerUser.pending, (state, action) => {
                state.isPending = true;
            })
            // Register success
            .addCase(authActions.registerUser.fulfilled, (state, action) => {
                state.isPending = false;
            })
            // Register failure
            .addCase(authActions.registerUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.isPending = false;
                state.error = error;
            })

            // Login pending
            .addCase(authActions.loginUser.pending, (state, action) => {
                state.isPending = true;
            })
            // Login success
            .addCase(authActions.loginUser.fulfilled, (state, action) => {
                const { jwt } = action.payload;
                state.isPending = false;
                state.isAuthenticated = true;
                state.jwt = jwt;
            })
            // Login failure
            .addCase(authActions.loginUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.isPending = false;
                state.error = error;
            })

            // Refresh token success
            .addCase(authActions.refreshUserToken.fulfilled, (state, action) => {
                const { jwt } = action.payload;
                state.isAuthenticated = true;
                state.jwt = jwt;
            })
            // Refresh token failed
            .addCase(authActions.refreshUserToken.rejected, (state, action) => {
                const { error } = action.payload;
                state.isAuthenticated = false;
                state.jwt = null;
                state.error = error;
            })

            // Logout success
            .addCase(authActions.logoutUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.jwt = null;
            })
            // Logout failure
            .addCase(authActions.logoutUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.error = error;
            });
    }
});

export default authSlice.reducer;