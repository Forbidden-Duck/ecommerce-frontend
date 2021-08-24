import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { Person as PersonIcon } from "@material-ui/icons";
import { getUserFromCache } from "../../store/user/User.actions";
import { Button } from "@material-ui/core";

function Admin() {
    return (
        <Router>
            <Switch>
                <Route exact path="/admin" component={AdminHome} />
                <Redirect from="*" to="/admin" />
            </Switch>
        </Router>
    );
}

function AdminHome() {
    const dispatch = useDispatch();
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
    const { fetchedUser } = useSelector((state) => state.user);

    const [firstName, setFirstName] = useState("Loading...");

    useEffect(() => {
        dispatch(getUserFromCache(userid));
    }, [dispatch, userid]);

    useEffect(() => {
        setFirstName(
            fetchedUser?._id === userid ? fetchedUser.firstname : "Loading..."
        );
    }, [userid, fetchedUser]);

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
