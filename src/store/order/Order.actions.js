import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as orderAPI from "../../api/order";

export const findOrders = createAsyncThunk(
    "api/findOrders",
    async (data, thunkAPI) => {
        const res = await orderAPI.findMany(data.filter, data.token);
        return {
            orders: res,
        };
    }
);

export const getOrder = createAsyncThunk(
    "api/getOrder",
    async (data, thunkAPI) => {
        const res = await orderAPI.getOne(data.orderid, data.token);
        return {
            order: res,
        };
    }
);

export const clearOrderError = createAction("api/clearOrderError");
export const getOrderFromCache = createAction("api/getOrderFromCache");
export const deleteOrderFromCache = createAction("api/deleteOrderFromCache");
