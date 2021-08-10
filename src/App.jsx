import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import "./App.css";

// TODO Routes

import Navbar from "./components/Navbar/Navbar";
// TODO LoggedInRoute (For logged in only routes)
// TODO AdminRoute (For admin specific routes)

function App() {
    return (
        <div style={{ flex: 1 }}>
            <Router>
                <Navbar />
                <Switch>
                    {/* Public Routes */}

                    {/* Logged-in Only Routes */}

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
