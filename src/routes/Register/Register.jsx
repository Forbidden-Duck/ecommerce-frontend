import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, IconButton, Divider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    loginUser,
    registerUser,
    googleAuth,
    clearError,
} from "../../store/auth/Auth.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import "./Register.css";

import { GoogleLogin } from "react-google-login";

function Register() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { googleError, isAuthenticated, error, isPending } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const useStyles = makeStyles((theme) => ({
        title: {
            color: "#558db5",
            textDecoration: "none",
        },
    }));
    const classes = useStyles();

    const handleRegister = async (credentials) => {
        await dispatch(registerUser(credentials));
    };
    const formatGoogleError = (message) => {
        switch (message) {
            case "Missing authorization header":
            case "invalid_token":
            case "Unauthorized":
            case "Missing password in the body":
                return message; //"Failed to authorize";
            default:
                return message;
        }
    };

    const [submit, setSubmit] = useState({
        submitClick: false,
        auth: {},
        setFieldValue: null,
        googleAuth: null,
    });
    useEffect(() => {
        if (submit.submitClick && !error) {
            if (!isAuthenticated || submit.googleAuth) {
                (async () => {
                    if (
                        submit.auth &&
                        submit.auth.email &&
                        submit.auth.password
                    ) {
                        await dispatch(loginUser(submit.auth));
                    }
                    const redirect = new URLSearchParams(location.search).get(
                        "redirect"
                    );
                    redirect
                        ? history.push(decodeURIComponent(redirect))
                        : history.push("/");
                })();
            } else {
                if (submit.setFieldValue) {
                    submit.setFieldValue("firstname", "");
                    submit.setFieldValue("lastname", "");
                    submit.setFieldValue("email", "");
                    submit.setFieldValue("password", "");
                    submit.setFieldValue("confirmPassword", "");
                }
            }
            setSubmit({ submitClick: false, auth: {}, setFieldValue: null });
        }
    }, [
        history,
        error,
        submit,
        setSubmit,
        dispatch,
        location,
        isAuthenticated,
    ]);

    const onSubmit = async (values, { setFieldValue }) => {
        const { firstname, lastname, email, password } = values;
        await handleRegister({
            firstname,
            lastname,
            email,
            password,
        });
        setSubmit({
            submitClick: true,
            auth: { email, password },
            setFieldValue,
        });
    };

    const handleGoogle = async (res) => {
        await dispatch(googleAuth({ token: res.tokenId }));
        setSubmit({
            submitClick: true,
            googleAuth: true,
        });
    };

    const credentialsSchema = Yup.object().shape({
        firstname: Yup.string()
            .min(2, "First name must be longer than 2 characters")
            .required("First name is required"),
        lastname: Yup.string()
            .min(2, "Last name must be longer than 2 characters")
            .required("Last name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email address is required"),
        password: Yup.string().required("Password is required"),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Password does not match"
        ),
    });

    return (
        <div className="appRegister">
            <div className="formWrapperRegister">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={credentialsSchema}
                    validateOnBlur
                    onSubmit={onSubmit}
                >
                    <Form className="baseFormRegister">
                        <h1 className="baseFormHeadingRegister">Register</h1>
                        <TextField
                            label="First name"
                            name="firstname"
                            id="firstname-input"
                            autoComplete="given-name"
                        />
                        <TextField
                            label="Last name"
                            name="lastname"
                            id="lastname-input"
                            autoComplete="family-name"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            id="email-input"
                            autoComplete="email"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            id="password-input"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
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
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            id="confirmpassword-input"
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
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
                        {error && <div>{error}</div>}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            isLoading={isPending}
                        >
                            Register
                        </Button>
                        <Typography
                            className={classes.title}
                            component={Link}
                            to={`/login${location.search}`}
                        >
                            Login instead?
                        </Typography>
                        <Divider />
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <p>Sign up with</p>
                            </div>
                            <div className="social-btn-containerRegister">
                                {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
                                    <div>
                                        <GoogleLogin
                                            clientId={
                                                process.env
                                                    .REACT_APP_GOOGLE_CLIENT_ID
                                            }
                                            buttonText="Sign up with Google"
                                            onSuccess={handleGoogle}
                                            onFailure={(err) =>
                                                console.log(err)
                                            }
                                            cookiePolicy={"single_host_origin"}
                                        />
                                        {googleError && (
                                            <div style={{ color: "red" }}>
                                                {formatGoogleError(googleError)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Register;
