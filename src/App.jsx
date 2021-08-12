import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { refreshUserToken } from "./store/auth/Auth.actions";

// TODO Routes
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Register from "./routes/Register/Register";

import Navbar from "./components/Navbar/Navbar";
// TODO LoggedInRoute (For logged in only routes)
// TODO AdminRoute (For admin specific routes)

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, jwt, refreshError, isPending } = useSelector(
        (state) => state.auth
    );
    const [timer, setTimer] = useState(null);

    if (!isAuthenticated && !refreshError && !isPending) {
        // Log user in with refresh token
        dispatch(refreshUserToken());
    }

    if (isAuthenticated && !timer) {
        // Refresh token when JWT expires
        const expiryDate = new Date(jwt.expiresIn);
        const difference = expiryDate.getTime() - new Date().getTime();
        setTimer(setTimeout(() => dispatch(refreshUserToken()), difference));
    } else if (!isAuthenticated && timer) {
        clearTimeout(timer);
        setTimer(null);
    }

    const { darkMode } = useSelector((state) => state.site);
    return (
        <div style={{ flex: 1, background: darkMode ? "#222" : "#fff" }}>
            <Router>
                <Navbar />
                <Switch>
                    {/* Public Routes */}
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />

                    {/* Logged-in Only Routes */}

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
