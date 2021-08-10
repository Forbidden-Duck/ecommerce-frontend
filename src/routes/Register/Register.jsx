import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { registerUser } from "../../store/auth/Auth.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import "./Register.css";

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { error, isPending } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.user);

    if (user) {
        history.push("/");
    }

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
                    }}
                >
                    <Form className="baseForm">
                        <h1 className="baseFormHeading">Register</h1>
                        <TextField
                            label="First name"
                            name="firstname"
                            id="firstname-input"
                        />
                        <TextField
                            label="Last name"
                            name="lastname"
                            id="lastname-input"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            id="email-input"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            id="password-input"
                            type="password"
                            autoComplete="on"
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
                            variant="p"
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
