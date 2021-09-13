import { createSlice } from "@reduxjs/toolkit";
import * as orderActions from "./Order.actions";
import { checkoutCart } from "../cart/Cart.actions";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        isPending: false,
        error: null,
        recentOrder: null,
        fetchedOrder: null,
        orderCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Checkout success
            .addCase(checkoutCart.fulfilled, (state, action) => {
                const { order } = action.payload;
                state.orderCache[order._id] = order;
                state.recentOrder = order;
            })

            // Clear order error
            .addCase(orderActions.clearOrderError, (state) => {
                state.error = null;
            })
            // Get order from cache
            .addCase(orderActions.getOrderFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    state.fetchedOrder =
                        state.orderCache[action.payload] || null;
                }
            })
            // Delete order from cache
            .addCase(orderActions.deleteOrderFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    delete state.fetchedOrder[action.payload];
                }
            })

            // Find orders pending
            .addCase(orderActions.findOrders.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Find orders success
            .addCase(orderActions.findOrders.fulfilled, (state, action) => {
                const { orders } = action.payload;
                state.isPending = false;
                state.error = null;
                state.orderCache = {};
                for (const order of orders) {
                    state.orderCache[order._id] = order;
                }
            })
            // Find orders failure
            .addCase(orderActions.findOrders.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get order pending
            .addCase(orderActions.getOrder.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Get order success
            .addCase(orderActions.getOrder.fulfilled, (state, action) => {
                const { order } = action.payload;
                state.isPending = false;
                state.error = null;
                state.orderCache[order._id] = order;
            })
            // Get order failure
            .addCase(orderActions.getOrder.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default orderSlice.reducer;
