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
import Unauthorized from "./routes/Errors/Unauthorized";
import Admin from "./routes/Admin/Admin";

import Navbar from "./components/Navbar/Navbar";
import LoggedInRoute from "./components/LoggedInRoute/LoggedInRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";

import { useMediaQuery } from "@material-ui/core";

function App() {
    // is mobile check
    const isMobile = useMediaQuery("(max-width:640px)");

    const dispatch = useDispatch();
    const { isAuthenticated, jwt, refreshError, isPending } = useSelector(
        (state) => state.auth
    );
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (!isAuthenticated && !refreshError && !isPending) {
            // Log user in with refresh token
            dispatch(refreshUserToken());
        }

        if (isAuthenticated && !timer) {
            // Refresh token when JWT expires
            const expiryDate = new Date(jwt.expiresIn);
            const difference = expiryDate.getTime() - new Date().getTime();
            setTimer(
                setTimeout(() => dispatch(refreshUserToken()), difference)
            );
        } else if (!isAuthenticated && timer) {
            clearTimeout(timer);
            setTimer(null);
        }
    }, [isAuthenticated, refreshError, isPending, timer, dispatch, jwt]);

    const { darkMode } = useSelector((state) => state.site);
    return (
        <div style={{ flex: 1, background: darkMode ? "#292929" : "#f2f2f2" }}>
            <Router>
                <Navbar isMobile={isMobile} />
                <Switch>
                    {/* Public Routes */}
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />

                    {/* Logged-in Only Routes */}
                    <LoggedInRoute path="/profile" Component={Profile} />

                    {/* Admin Only Routes */}
                    <Route
                        exact
                        path="/unauthorized"
                        component={Unauthorized}
                    />
                    <AdminRoute path="/admin" Component={Admin} />

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
