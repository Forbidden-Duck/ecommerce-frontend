import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as cartAPI from "../../api/cart";

export const findCarts = createAsyncThunk(
    "api/findCarts",
    async (data, thunkAPI) => {
        const res = await cartAPI.findMany(data.filter, data.token);
        return {
            carts: res,
        };
    }
);

export const getCart = createAsyncThunk(
    "api/getCart",
    async (data, thunkAPI) => {
        const res = await cartAPI.getOne(data.cartid, data.token);
        return {
            cart: res,
        };
    }
);

export const createCart = createAsyncThunk(
    "api/createCart",
    async (data, thunkAPI) => {
        const res = await cartAPI.createOne(data.token, {
            adminBody: data.adminBody,
        });
        return {
            cart: res,
        };
    }
);

export const addCartItem = createAsyncThunk(
    "api/addCartItem",
    async (data, thunkAPI) => {
        const res = await cartAPI.addItemOne(
            data.cartid,
            data.token,
            data.cartitem
        );
        return {
            cart: res.cart,
            cartitem: res.cartitem,
        };
    }
);

export const updateCartItem = createAsyncThunk(
    "api/updateCartItem",
    async (data, thunkAPI) => {
        const res = await cartAPI.updateItemOne(
            data.cartid,
            data.cartitemid,
            data.token,
            data.cartitem
        );
        return {
            cart: res.cart,
            cartitem: res.cartitem,
        };
    }
);

export const deleteCartItem = createAsyncThunk(
    "api/deleteCartItem",
    async (data, thunkAPI) => {
        const res = await cartAPI.deleteItemOne(
            data.cartid,
            data.cartitemid,
            data.token
        );
        return {
            cart: res.cart,
            cartitem: res.cartitem,
        };
    }
);

export const checkoutCart = createAsyncThunk(
    "api/checkoutCart",
    async (data, thunkAPI) => {
        const res = await cartAPI.checkout(data.cartid, data.token);
        return {
            order: res.order,
            charge: res.charge,
            cartid: data.cartid,
        };
    }
);

export const clearCartError = createAction("api/clearCartError");
export const getCartFromCache = createAction("api/getCartFromCache");
export const deleteCartFromCache = createAction("api/deleteCartFromCache");
export const setCheckout = createAction("api/setCheckout");
