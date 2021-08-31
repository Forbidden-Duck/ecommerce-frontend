import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    Link,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { Person as PersonIcon } from "@material-ui/icons";
import { Button } from "@material-ui/core";

import AdminUsers from "./Users/AdminUsers";
import AdminViewUser from "./Users/AdminViewUser";
import AdminEditUser from "./Users/AdminEditUser";
import AdminDeleteUser from "./Users/AdminDeleteUser";

function Admin() {
    return (
        <Router>
            <Switch>
                <Route exact path="/admin" component={AdminHome} />
                <Route exact path="/admin/users" component={AdminUsers} />
                <Route
                    exact
                    path="/admin/user/:userid"
                    component={AdminViewUser}
                />
                <Route
                    exact
                    path="/admin/user/:userid/edit"
                    component={AdminEditUser}
                />
                <Route
                    exact
                    path="/admin/user/:userid/delete"
                    component={AdminDeleteUser}
                />
                <Redirect from="/admin/user" to="/admin/users" />
                <Redirect from="/admin/users/*" to="/admin/users" />
                <Redirect from="*" to="/admin" />
            </Switch>
        </Router>
    );
}

function AdminHome() {
    const { darkMode } = useSelector((state) => state.site);
    const isSmall = useMediaQuery("(max-width:550px)");

    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "99.83vw",
            height: "92.5vh",
        },
        text: {
            fontSize: "clamp(2.3em, 10vw, 4em)",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
        button: {},
    }));
    const classes = useStyles();

    const { userid } = useSelector((state) => state.auth);
    const { authedUser } = useSelector((state) => state.user);

    const [firstName, setFirstName] = useState("Loading...");

    useEffect(() => {
        setFirstName(
            authedUser?._id === userid ? authedUser.firstname : "Loading..."
        );
    }, [userid, authedUser]);

    return (
        <div className={classes.app}>
            <Typography className={classes.text} variant="h3">
                Hello {firstName}
            </Typography>
            {firstName !== "Loading..." && (
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    startIcon={<PersonIcon />}
                    size={isSmall ? "small" : "medium"}
                    component={Link}
                    to="/admin/users"
                >
                    Users
                </Button>
            )}
        </div>
    );
}

export default Admin;
