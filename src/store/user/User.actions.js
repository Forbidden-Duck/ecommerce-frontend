import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as userAPI from "../../api/user";

export const getUsers = createAsyncThunk(
    "api/getUsers",
    async (data, thunkAPI) => {
        const res = await userAPI.getMany(data.token);
        return {
            users: res,
        };
    }
);

export const getUser = createAsyncThunk(
    "api/getUser",
    async (data, thunkAPI) => {
        const res = await userAPI.getOne(data.userid, data.token);
        return {
            user: res,
        };
    }
);

export const updateUser = createAsyncThunk(
    "api/updateUser",
    async (data, thunkAPI) => {
        const res = await userAPI.updateOne(data.userid, data.token, data.data);
        return {
            user: res,
        };
    }
);

export const deleteUser = createAsyncThunk(
    "api/deleteUser",
    async (data, thunkAPI) => {
        await userAPI.deleteOne(data.userid, data.token);
        return {
            userid: data.userid,
        };
    }
);

export const clearUserError = createAction("api/clearUserError");
export const getUserFromCache = createAction("api/getUserFromCache");
export const deleteUserFromCache = createAction("api/deleteUserFromCache");
