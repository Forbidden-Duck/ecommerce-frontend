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

    if (!isAuthenticated && !refreshError && !isPending) {
        dispatch(refreshUserToken());
    }

    // const [timer, setTimer] = useState(null);

    // console.log(timer);
    // if (isAuthenticated && !timer) {
    //     const expiryDate = new Date(jwt.expiresIn);
    //     const difference = expiryDate.getTime() - new Date().getTime();
    //     console.log("inside");
    //     setTimer(
    //         setTimeout(() => {
    //             console.log("timeout");
    //         }, 5000)
    //     );
    // } else if (!isAuthenticated && timer) {
    //     clearTimeout(timer);
    //     setTimer(null);
    // }

    return (
        <div style={{ flex: 1, background: "#222" }}>
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
