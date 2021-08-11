import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import rootReducer from "./store/rootReducer";
import "./index.css";

// Initialise redux store
const store = configureStore({ reducer: rootReducer });

console.log("Allo, what you doing in here?");
ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.getElementById("root")
);
