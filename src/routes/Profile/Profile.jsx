import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Typography, Card, Chip } from "@material-ui/core";
import { Gavel as GavelIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    getUser,
    updateUser,
    deleteUser,
    clearUserError,
    getUserFromCache,
} from "../../store/user/User.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";

function Profile() {
    const dispatch = useDispatch();

    // "@media (max-width:600px)"
    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
        },
        card: {
            width: "350px",
            height: "500px",
            position: "relative",
        },
        content: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
        },
        pfp: {
            backgroundImage: "url(/images/profilePicture.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "50%",
            margin: "10px 0px",
            width: "200px",
            height: "200px",
        },
        tag: {
            top: "37%",
            left: "13%",
            position: "absolute",
        },
        footer: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: ".7rem",
            textAlign: "left",
            color: "#787878",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginLeft: "10px",
        },
    }));
    const classes = useStyles();

    const { userid } = useSelector((state) => state.auth);
    const { fetchedUser } = useSelector((state) => state.user);
    if (!fetchedUser || fetchedUser._id !== userid) {
        dispatch(getUserFromCache(userid));
    }

    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        createdAt: "Loading...",
    });

    useEffect(() => {
        setUser(
            fetchedUser?._id === userid
                ? {
                      name: `${fetchedUser.firstname} ${fetchedUser.lastname}`,
                      email: fetchedUser.email,
                      createdAt: new Date(
                          fetchedUser.createdAt
                      ).toLocaleString(),
                  }
                : {
                      name: "Loading...",
                      email: "Loading...",
                      createdAt: "Loading...",
                  }
        );
    }, [userid, fetchedUser]);

    return (
        <div className={classes.app}>
            <Card className={classes.card}>
                <div className={classes.content}>
                    <div className={classes.pfp} />
                    {fetchedUser?.admin && (
                        <Chip
                            className={classes.tag}
                            label={<GavelIcon />}
                            color="primary"
                        />
                    )}
                    <Typography variant="h4">{user.name}</Typography>
                    <Typography>{user.email}</Typography>
                </div>
                <div className={classes.footer}>
                    <p>Created At • {user.createdAt}</p>
                </div>
            </Card>
        </div>
    );
}

export default Profile;
