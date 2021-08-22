import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    InputAdornment,
    IconButton,
    Typography,
    Card,
    Chip,
} from "@material-ui/core";
import {
    Gavel as GavelIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    getUser,
    updateUser,
    deleteUser,
    clearUserError,
    getUserFromCache,
} from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

function Profile() {
    const dispatch = useDispatch();

    // "@media (max-width:600px)"
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
        // Form Content
        form: {
            display: "grid",
            rowGap: "30px",
            margin: "30px",
        },
        formCard: {
            width: "600px",
            position: "relative",
        },
    }));
    const classes = useStyles();

    const { userid, jwt } = useSelector((state) => state.auth);
    const { fetchedUser, error, isPending } = useSelector(
        (state) => state.user
    );
    if (userid && fetchedUser?._id !== userid) {
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

    const [onSubmit, setOnSubmit] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const handleEditClick = (value) => {
        setEditProfile(typeof value === "boolean" ? value : !editProfile);
        setOnSubmit(false);
        dispatch(clearUserError());
    };
    const [deleteAccount, setDeleteAccount] = useState(false);
    const handleDeleteClick = (value) => {
        setDeleteAccount(typeof value === "boolean" ? value : !deleteAccount);
        setOnSubmit(false);
        dispatch(clearUserError());
    };
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const userSchema = Yup.object()
        .shape({
            firstname: Yup.string().min(
                2,
                "First name must be longer than 2 characters"
            ),
            lastname: Yup.string().min(
                2,
                "Last name must be longer than 2 characters"
            ),
            email: Yup.string().email("Invalid email address"),
            password: Yup.string().required("Password is required"),
        })
        .test("oneExists", null, (user) => {
            if (user.email || user.firstname || user.lastname) return true;
            return new Yup.ValidationError(
                "Must edit at least 1 field",
                null,
                "oneExists"
            );
        });

    const handleSave = async (user, password) => {
        for (const [key, value] of Object.entries(user)) {
            // Delete the empty strings
            if (!value) {
                delete user[key];
            }
        }
        await dispatch(
            updateUser({ userid, user, password, token: jwt.token })
        );
    };
    const formatError = (message) => {
        switch (message) {
            case "Unauthorized":
                return "Incorrect password";
            default:
                return message;
        }
    };

    if (onSubmit && !error) {
        handleEditClick(false);
        dispatch(getUserFromCache(userid));
    }

    return (
        <div className={classes.app}>
            {!editProfile && !deleteAccount && (
                <Card className={classes.card}>
                    <div className={classes.cardContent}>
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
                    <div className={classes.cardFooter}>
                        {user.name !== "Loading..." && (
                            <Button
                                style={{ marginRight: "10px" }}
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEditClick}
                            >
                                Edit
                            </Button>
                        )}
                        {user.name !== "Loading..." && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </Button>
                        )}
                        <p>Created At • {user.createdAt}</p>
                    </div>
                </Card>
            )}
            {editProfile && (
                <Formik
                    initialValues={{
                        email: "",
                        firstname: "",
                        lastname: "",
                        password: "",
                    }}
                    validationSchema={userSchema}
                    validateOnBlur
                    onSubmit={async (values) => {
                        const { email, firstname, lastname, password } = values;
                        await handleSave(
                            { email, firstname, lastname },
                            password
                        );
                        setOnSubmit(true);
                    }}
                >
                    {(formProps) => (
                        <Card className={classes.formCard}>
                            <Form className={classes.form}>
                                <Typography variant="h4">
                                    Edit Profile
                                </Typography>
                                <TextField
                                    label="Email"
                                    name="email"
                                    id="email-input"
                                    autoComplete="email"
                                    placeholder={user.email}
                                />
                                <TextField
                                    label="First name"
                                    name="firstname"
                                    id="firstname-input"
                                    autoComplete="given-name"
                                    placeholder={fetchedUser.firstname}
                                />
                                <TextField
                                    label="Last name"
                                    name="lastname"
                                    id="lastname-input"
                                    autoComplete="family-name"
                                    placeholder={fetchedUser.lastname}
                                />
                                {formProps.errors.oneExists && (
                                    <div style={{ marginTop: "-20px" }}>
                                        {formProps.errors.oneExists}
                                    </div>
                                )}
                                <TextField
                                    style={{ marginTop: "30px" }}
                                    label="Password"
                                    name="password"
                                    id="password-input"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {error && <div>{formatError(error)}</div>}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    isLoading={isPending}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="button"
                                    style={{ marginTop: "-20px" }}
                                    onClick={handleEditClick}
                                >
                                    Cancel
                                </Button>
                            </Form>
                        </Card>
                    )}
                </Formik>
            )}
        </div>
    );
}

export default Profile;
