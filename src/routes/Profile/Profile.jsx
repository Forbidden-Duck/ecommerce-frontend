import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    Link,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Card, Chip } from "@material-ui/core";
import {
    Gavel as GavelIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../components/Button/Button";

import ProfileEdit from "./ProfileEdit";
import ProfileEditPassword from "./ProfileEditPassword";
import ProfileDelete from "./ProfileDelete";

function Profile() {
    return (
        <Router>
            <Switch>
                <Route exact path="/profile" component={ProfileHome} />
                <Route exact path="/profile/delete" component={ProfileDelete} />
                <Route exact path="/profile/edit" component={ProfileEdit} />
                <Route
                    exact
                    path="/profile/edit/password"
                    component={ProfileEditPassword}
                />
                <Redirect from="/profile/edit/*" to="/profile/edit" />
                <Redirect from="*" to="/profile" />
            </Switch>
        </Router>
    );
}

function ProfileHome() {
    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
        },
        // Card Content
        card: {
            width: "350px",
            height: "500px",
            position: "relative",
        },
        cardContent: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            height: "405px",
        },
        cardPfp: {
            backgroundImage: "url(/images/profilePicture.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "50%",
            margin: "10px 0px",
            width: "200px",
            height: "200px",
        },
        cardTag: {
            top: "37%",
            left: "13%",
            position: "absolute",
        },
        cardFooter: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: ".7rem",
            textAlign: "left",
            color: "#787878",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginLeft: "10px",
        },
        cardFooterButtons: {
            display: "flex",
            justifyContent: "center",
        },
    }));
    const classes = useStyles();

    const { authedUser } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        createdAt: "Loading...",
        modifiedAt: "Loading...",
    });

    useEffect(() => {
        setUser(
            authedUser?._id
                ? {
                      name: `${authedUser.firstname} ${authedUser.lastname}`,
                      email: authedUser.email,
                      createdAt: new Date(
                          authedUser.createdAt
                      ).toLocaleString(),
                      modifiedAt: authedUser.modifiedAt
                          ? new Date(authedUser.modifiedAt).toLocaleString()
                          : "N/A",
                  }
                : {
                      name: "Loading...",
                      email: "Loading...",
                      createdAt: "Loading...",
                      modifiedAt: "Loading...",
                  }
        );
    }, [authedUser]);

    return (
        <div className={classes.app}>
            <Card className={classes.card}>
                <div className={classes.cardContent}>
                    <div className={classes.cardPfp} />
                    {authedUser?.admin && (
                        <Chip
                            className={classes.cardTag}
                            label={<GavelIcon />}
                            color="primary"
                        />
                    )}
                    <Typography variant="h4">{user.name}</Typography>
                    <Typography>{user.email}</Typography>
                </div>
                <div className={classes.cardFooterButtons}>
                    {user.name !== "Loading..." && (
                        <Button
                            style={{
                                marginRight: "10px",
                            }}
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            component={Link}
                            to="/profile/edit"
                        >
                            Edit
                        </Button>
                    )}
                    {user.name !== "Loading..." && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            component={Link}
                            to="/profile/delete"
                        >
                            Delete
                        </Button>
                    )}
                </div>
                <div className={classes.cardFooter}>
                    <p>Created At • {user.createdAt}</p>
                    <p>Last Saved At • {user.modifiedAt}</p>
                </div>
            </Card>
        </div>
    );
}

export default Profile;
