import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Chip } from "@material-ui/core";
import {
    Person as IDIcon,
    ArrowBack as GoBackIcon,
    Gavel as GavelIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { getUserFromCache, getUser } from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import useClipboard from "react-use-clipboard";

function AdminViewUser() {
    const dispatch = useDispatch();
    const { userid } = useParams();

    // "@media (max-width:600px)"
    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
        },
        buttonWrapper: {
            width: "350px",
            marginBottom: "5px",
        },
        error: {
            background: "rgba(255,0,0,.5)",
            width: "100%",
            fontWeight: 500,
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
            wordWrap: "break-word",
            wordBreak: "break-all",
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
        "@media (max-width:350px)": {
            card: {
                width: "100vw",
            },
            buttonWrapper: {
                width: "100vw",
            },
        },
    }));
    const classes = useStyles();

    const { jwt } = useSelector((state) => state.auth);
    const { fetchedUser, error } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        createdAt: "Loading...",
        modifiedAt: "Loading...",
    });

    useEffect(() => {
        (async () => {
            await dispatch(getUser({ userid: userid, token: jwt.token }));
            dispatch(getUserFromCache(userid));
        })();
    }, [dispatch, userid, jwt]);

    useEffect(() => {
        setUser(
            fetchedUser?._id === userid
                ? {
                      name: `${fetchedUser.firstname} ${fetchedUser.lastname}`,
                      email: fetchedUser.email,
                      createdAt: new Date(
                          fetchedUser.createdAt
                      ).toLocaleString(),
                      modifiedAt: fetchedUser.modifiedAt
                          ? new Date(fetchedUser.modifiedAt).toLocaleString()
                          : "N/A",
                  }
                : {
                      name: "Loading...",
                      email: "Loading...",
                      createdAt: "Loading...",
                      modifiedAt: "Loading...",
                  }
        );
    }, [userid, fetchedUser]);

    const [isCopied, setCopy] = useClipboard(userid, {
        successDuration: 2000,
    });

    return (
        <div className={classes.app}>
            <div className={classes.buttonWrapper}>
                <Button
                    style={{ marginRight: "5px" }}
                    variant="contained"
                    color="secondary"
                    startIcon={<GoBackIcon />}
                    component={Link}
                    to="/admin/users"
                >
                    Go back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IDIcon />}
                    onClick={setCopy}
                >
                    {isCopied ? "Copied!" : "Copy ID"}
                </Button>
            </div>
            <Card className={classes.card}>
                <div className={classes.cardContent}>
                    {error && (
                        <Typography className={classes.error}>
                            {error}
                        </Typography>
                    )}
                    <div className={classes.cardPfp} />
                    {fetchedUser?.admin && (
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
                            to={`/admin/user/${userid}/edit`}
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
                            to={`/admin/user/${userid}/delete`}
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

export default AdminViewUser;
