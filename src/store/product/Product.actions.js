import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as productAPI from "../../api/product";

export const getProducts = createAsyncThunk(
    "api/getProducts",
    async (data, thunkAPI) => {
        const res = await productAPI.getMany(data.token);
        return {
            products: res,
        };
    }
);

export const getProduct = createAsyncThunk(
    "api/getProduct",
    async (data, thunkAPI) => {
        const res = await productAPI.getOne(data.productid, data.token);
        return {
            product: res,
        };
    }
);

export const createProduct = createAsyncThunk(
    "api/createProduct",
    async (data, thunkAPI) => {
        const res = await productAPI.createOne(
            data.userid,
            data.token,
            data.product
        );
        return {
            product: res,
        };
    }
);

export const updateProduct = createAsyncThunk(
    "api/updateProduct",
    async (data, thunkAPI) => {
        const res = await productAPI.updateOne(
            data.productid,
            data.token,
            data.product
        );
        return {
            product: res,
        };
    }
);

export const deleteProduct = createAsyncThunk(
    "api/deleteUser",
    async (data, thunkAPI) => {
        await productAPI.deleteOne(data.productid, data.token);
        return {
            productid: data.productid,
        };
    }
);

export const clearProductError = createAction("api/clearProductError");
export const getProductFromCache = createAction("api/getProductFromCache");
export const deleteProductFromCache = createAction(
    "api/deleteProductFromCache"
);
