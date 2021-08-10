import React from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import "./App.css";

// TODO Routes
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";

import Navbar from "./components/Navbar/Navbar";
// TODO LoggedInRoute (For logged in only routes)
// TODO AdminRoute (For admin specific routes)

function App() {
    return (
        <div style={{ flex: 1, background: "#222" }}>
            <Router>
                <Navbar />
                <Switch>
                    {/* Public Routes */}
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />

                    {/* Logged-in Only Routes */}

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
