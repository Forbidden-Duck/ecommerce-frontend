import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "../../api/auth";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data, thunkAPI) => {
        const res = await authAPI.register(data);
        return {
            user: res,
        };
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, thunkAPI) => {
        const res = await authAPI.login(data);
        return {
            userid: res.userid,
            admin: res.admin,
            jwt: {
                token: res.token,
                expiresIn: res.expiresIn,
            },
        };
    }
);

export const refreshUserToken = createAsyncThunk(
    "auth/refreshUserToken",
    async (data, thunkAPI) => {
        const res = await authAPI.refreshtoken();
        return {
            userid: res.userid,
            admin: res.admin,
            jwt: {
                token: res.token,
                expiresIn: res.expiresIn,
            },
        };
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (data, thunkAPI) => {
        await authAPI.logout();
    }
);
