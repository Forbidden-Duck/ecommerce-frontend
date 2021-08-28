import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
    InputAdornment,
    IconButton,
    Typography,
    Card,
} from "@material-ui/core";
import {
    Lock as PasswordIcon,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { updateUser, clearUserError } from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

function ProfileEdit() {
    const dispatch = useDispatch();
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
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
    const { authedUser, error, isPending } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        createdAt: "Loading...",
    });

    useEffect(() => {
        dispatch(clearUserError());
    }, [dispatch]);

    useEffect(() => {
        setUser(
            authedUser?._id
                ? {
                      name: `${authedUser.firstname} ${authedUser.lastname}`,
                      email: authedUser.email,
                      createdAt: new Date(
                          authedUser.createdAt
                      ).toLocaleString(),
                  }
                : {
                      name: "Loading...",
                      email: "Loading...",
                      createdAt: "Loading...",
                  }
        );
    }, [authedUser]);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const editSchema = Yup.object()
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
            case "Password is required to validate the user":
            case "Unauthorized":
                return "Incorrect password";
            default:
                return message;
        }
    };

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push("/profile");
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit]);

    const onSubmit = async (values) => {
        const { email, firstname, lastname, password } = values;
        await handleSave({ email, firstname, lastname }, password);
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            {authedUser && (
                <Formik
                    initialValues={{
                        email: "",
                        firstname: "",
                        lastname: "",
                        password: "",
                    }}
                    validationSchema={editSchema}
                    validateOnBlur
                    onSubmit={onSubmit}
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
                                    placeholder={authedUser.firstname}
                                />
                                <TextField
                                    label="Last name"
                                    name="lastname"
                                    id="lastname-input"
                                    autoComplete="family-name"
                                    placeholder={authedUser.lastname}
                                />
                                {formProps.errors.oneExists && (
                                    <div
                                        style={{
                                            marginTop: "-20px",
                                        }}
                                    >
                                        {formProps.errors.oneExists}
                                    </div>
                                )}
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PasswordIcon />}
                                        component={Link}
                                        to="/profile/edit/password"
                                    >
                                        Change Password
                                    </Button>
                                </div>
                                <TextField
                                    style={{
                                        marginTop: "30px",
                                    }}
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
                                    style={{
                                        marginTop: "-20px",
                                    }}
                                    component={Link}
                                    to={"/profile"}
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

export default ProfileEdit;
