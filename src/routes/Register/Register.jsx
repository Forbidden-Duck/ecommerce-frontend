import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    loginUser,
    registerUser,
    clearError,
} from "../../store/auth/Auth.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import "./Register.css";

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { error, isPending } = useSelector((state) => state.auth);

    const [doClear, setDoClear] = useState(true);
    if (doClear) {
        dispatch(clearError());
        setDoClear(false);
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const useStyles = makeStyles((theme) => ({
        title: {
            color: "#558db5",
            textDecoration: "none",
        },
    }));
    const classes = useStyles();

    const handleLogin = async (credentials) => {
        if (credentials && credentials.email && credentials.password) {
            await dispatch(loginUser(credentials));
        }
        history.push("/");
    };
    const handleRegister = async (credentials) => {
        await dispatch(registerUser(credentials));
    };

    const [onSubmit, setOnSubmit] = useState({ submitClick: false, auth: {} });
    if (onSubmit.submitClick && !error) {
        handleLogin(onSubmit.auth);
        setOnSubmit({ submitClick: false, auth: {} });
    }

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
        <div className="app">
            <div className="formWrapper">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={credentialsSchema}
                    validateOnBlur
                    onSubmit={async (values) => {
                        const { firstname, lastname, email, password } = values;
                        await handleRegister({
                            firstname,
                            lastname,
                            email,
                            password,
                        });
                        setOnSubmit({
                            submitClick: true,
                            auth: { email, password },
                        });
                    }}
                >
                    <Form className="baseForm">
                        <h1 className="baseFormHeading">Register</h1>
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
                            autoComplete="current-password"
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
                            Submit
                        </Button>
                        <Typography
                            className={classes.title}
                            component={Link}
                            to="/login"
                        >
                            Login instead?
                        </Typography>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Login;
