import { createSlice } from "@reduxjs/toolkit";
import * as siteActions from "./Site.actions";

const siteSlice = createSlice({
    name: "site",
    initialState: {
        darkMode: localStorage.getItem("darkMode") === "true",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(siteActions.setDarkMode, (state, action) => {
            if (typeof action.payload === "boolean") {
                state.darkMode = action.payload;
                localStorage.setItem("darkMode", action.payload);
            }
        });
    },
});

export default siteSlice.reducer;
