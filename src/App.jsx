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
                    <Route exact path="/" component={Home} />

                    {/* Logged-in Only Routes */}

                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
