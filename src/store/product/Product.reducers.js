import { createSlice } from "@reduxjs/toolkit";
import * as productActions from "./Product.actions";

const productSlice = createSlice({
    name: "product",
    initialState: {
        isPending: false,
        error: null,
        fetchedProduct: null,
        productCache: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Clear product error
            .addCase(productActions.clearProductError, (state) => {
                state.error = null;
            })
            // Get product from cache
            .addCase(productActions.getProductFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    state.fetchedProduct =
                        state.productCache[action.payload] || null;
                }
            })
            // Delete product from cache
            .addCase(productActions.deleteProductFromCache, (state, action) => {
                if (typeof action.payload === "string") {
                    delete state.productCache[action.payload];
                }
            })

            // Get products pending
            .addCase(productActions.getProducts.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Get products success
            .addCase(productActions.getProducts.fulfilled, (state, action) => {
                const { products } = action.payload;
                state.isPending = false;
                state.error = null;
                for (const product of products) {
                    state.productCache[product._id] = product;
                }
            })
            // Get products failure
            .addCase(productActions.getProducts.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Get product pending
            .addCase(productActions.getProduct.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Get product success
            .addCase(productActions.getProduct.fulfilled, (state, action) => {
                const { product } = action.payload;
                state.isPending = false;
                state.productCache[product._id] = product;
                state.error = null;
            })
            // Get product failure
            .addCase(productActions.getProduct.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Create product pending
            .addCase(productActions.createProduct.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Create product success
            .addCase(
                productActions.createProduct.fulfilled,
                (state, action) => {
                    const { product } = action.payload;
                    state.productCache[product._id] = product;
                    state.isPending = false;
                    state.error = null;
                }
            )
            // Create product failure
            .addCase(productActions.deleteProduct.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Update product pending
            .addCase(productActions.updateProduct.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Update product success
            .addCase(
                productActions.updateProduct.fulfilled,
                (state, action) => {
                    const { product } = action.payload;
                    state.productCache[product._id] = product;
                    state.isPending = false;
                    state.error = null;
                }
            )
            // Update product failure
            .addCase(productActions.updateProduct.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            })

            // Delete product pending
            .addCase(productActions.deleteProduct.pending, (state, action) => {
                state.isPending = true;
                state.error = null;
            })
            // Delete product success
            .addCase(
                productActions.deleteProduct.fulfilled,
                (state, action) => {
                    const { productid } = action.payload;
                    delete state.productCache[productid];
                    state.isPending = false;
                    state.error = null;
                }
            )
            // Delete product failure
            .addCase(productActions.deleteProduct.rejected, (state, action) => {
                const { message } = action.error;
                state.isPending = false;
                state.error = message;
            });
    },
});

export default productSlice.reducer;
