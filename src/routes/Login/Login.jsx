import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { loginUser, clearError } from "../../store/auth/Auth.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import "./Login.css";

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { error, isPending, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/");
        }
    }, [isAuthenticated, history]);

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
        await dispatch(loginUser(credentials));
    };
    const formatError = (message) => {
        switch (message) {
            case "User not found":
                return "Incorrect email or password";
            case "Unauthorized":
                return "Incorrect email or password";
            default:
                return message;
        }
    };

    const credentialsSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email address is required"),
        password: Yup.string().required("Password is required"),
    });

    return (
        <div className="appLogin">
            <div className="formWrapperLogin">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={credentialsSchema}
                    validateOnBlur
                    onSubmit={async (values) => {
                        const { email, password } = values;
                        await handleLogin({ email, password });
                    }}
                >
                    <Form className="baseFormLogin">
                        <h1 className="baseFormHeadingLogin">Login</h1>
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
                        {error && <div>{formatError(error)}</div>}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            isLoading={isPending}
                        >
                            Login
                        </Button>
                        <Typography
                            className={classes.title}
                            component={Link}
                            to="/register"
                        >
                            Sign up instead?
                        </Typography>
                        <Divider />
                        <div>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <p>Sign in with</p>
                            </div>
                            <div className="social-btn-containerLogin">
                                <p>Google to be implemented</p>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Login;
