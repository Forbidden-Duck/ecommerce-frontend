import { createSlice } from "@reduxjs/toolkit";
import * as cartActions from "./Cart.actions";
import {
    loginUser,
    googleAuth,
    refreshUserToken,
    logoutUser,
} from "../auth/Auth.actions";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        isPending: false,
        error: null,
        authedUserID: null,
        authedCart: null,
        fetchedCart: null,
        cartCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login success
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.authedUserID = user._id;
            })
            // GoogleAuth success
            .addCase(googleAuth.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.authedUserID = user._id;
            })
            // Refresh token success
            .addCase(refreshUserToken.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.authedUserID = user._id;
            })
            // Logout success
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.authedUserID = null;
                state.authedCart = null;
            })

            // Clear cart error
            .addCase(cartActions.clearCartError, (state) => {
                state.error = null;
            })
            // Get cart from cache
            .addCase(cartActions.getCartFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    state.fetchedCart = state.cartCache[action.payload] || null;
                }
            })
            // Delete cart from cache
            .addCase(cartActions.deleteCartFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    delete state.fetchedCart[action.payload];
                }
            })
            // Set checkout
            .addCase(cartActions.setCheckout, (state, action) => {
                if (typeof action.payload === "boolean") {
                    state.checkout = action.payload;
                }
            })

            // Find carts pending
            .addCase(cartActions.findCarts.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Find carts success
            .addCase(cartActions.findCarts.fulfilled, (state, action) => {
                const { carts } = action.payload;
                state.isPending = false;
                state.error = null;
                state.cartCache = {};
                for (const cart of carts) {
                    state.cartCache[cart._id] = cart;
                    if (state.authedUserID === cart.userid) {
                        state.authedCart = cart;
                    }
                }
            })
            // Find carts failure
            .addCase(cartActions.findCarts.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get cart pending
            .addCase(cartActions.getCart.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Get cart success
            .addCase(cartActions.getCart.fulfilled, (state, action) => {
                const { cart } = action.payload;
                state.isPending = false;
                state.error = null;
                if (state.authedUserID === cart.userid) {
                    state.authedCart = cart;
                }
                state.cartCache[cart._id] = cart;
            })
            // Get cart failure
            .addCase(cartActions.getCart.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Create cart pending
            .addCase(cartActions.createCart.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Create cart success
            .addCase(cartActions.createCart.fulfilled, (state, action) => {
                const { cart } = action.payload;
                state.isPending = false;
                state.error = null;
                if (state.authedUserID === cart.userid) {
                    state.authedCart = cart;
                }
                state.cartCache[cart._id] = cart;
            })
            // Create cart failure
            .addCase(cartActions.createCart.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Add cart item pending
            .addCase(cartActions.addCartItem.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Add cart item success
            .addCase(cartActions.addCartItem.fulfilled, (state, action) => {
                const { cart } = action.payload;
                state.isPending = false;
                state.error = null;
                if (state.authedUserID === cart.userid) {
                    state.authedCart = cart;
                }
                state.cartCache[cart._id] = cart;
            })
            // Add cart item failure
            .addCase(cartActions.addCartItem.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Update cart item pending
            .addCase(cartActions.updateCartItem.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Update cart item success
            .addCase(cartActions.updateCartItem.fulfilled, (state, action) => {
                const { cart } = action.payload;
                state.isPending = false;
                state.error = null;
                if (state.authedUserID === cart.userid) {
                    state.authedCart = cart;
                }
                state.cartCache[cart._id] = cart;
            })
            // Update cart item failure
            .addCase(cartActions.updateCartItem.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Delete cart item pending
            .addCase(cartActions.deleteCartItem.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Delete cart item success
            .addCase(cartActions.deleteCartItem.fulfilled, (state, action) => {
                const { cart } = action.payload;
                state.isPending = false;
                state.error = null;
                if (state.authedUserID === cart.userid) {
                    state.authedCart = cart;
                }
                state.cartCache[cart._id] = cart;
            })
            // Delete cart item failure
            .addCase(cartActions.deleteCartItem.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Checkout cart pending
            .addCase(cartActions.checkoutCart.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Checkout cart success
            .addCase(cartActions.checkoutCart.fulfilled, (state, action) => {
                const { cartid } = action.payload;
                state.isPending = false;
                state.error = null;
                state.authedCart = null;
                delete state.cartCache[cartid];
            })
            // Checkout cart failure
            .addCase(cartActions.checkoutCart.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default cartSlice.reducer;
