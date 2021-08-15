import React, { useState, useEffect } from "react";
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
import Profile from "./routes/Profile/Profile";

import Navbar from "./components/Navbar/Navbar";
import LoggedInRoute from "./components/LoggedInRoute/LoggedInRoute";
// TODO AdminRoute (For admin specific routes)

function App() {
    // Handle window resize
    const [winDim, setWinDim] = useState(null);
    useEffect(() => {
        setWinDim(window.innerWidth);
    }, []);
    useEffect(() => {
        const handleResize = () => setWinDim(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        <div style={{ flex: 1, background: darkMode ? "#292929" : "#f2f2f2" }}>
            <Router>
                <Navbar winDim={winDim} />
                <Switch>
                    {/* Public Routes */}
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />

                    {/* Logged-in Only Routes */}
                    <LoggedInRoute exact path="/profile" Component={Profile} />

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
