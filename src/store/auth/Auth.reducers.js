import { createSlice } from "@reduxjs/toolkit";
import * as authActions from "./Auth.actions";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        error: null,
        jwt: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // Login success
            .addCase(authActions.loginUser.fulfilled, (state, action) => {
                const payload = action.payload;
                state.isAuthenticated = true;
                state.jwt = payload.jwt;
            })
            // Login failure
            .addCase(authActions.loginUser.rejected, (state, action) => {
                const { error } = action.payload;
                state.isAuthenticated = false;
                state.error = error;
            })
            // Register failure
            .addCase(authActions.registerUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.error = error;
            });
    }
});

export default authSlice.reducer;