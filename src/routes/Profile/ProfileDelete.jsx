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
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { deleteUser, clearUserError } from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

function ProfileDelete() {
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
    const { error, isPending } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(clearUserError());
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const deleteSchema = Yup.object().shape({
        password: Yup.string().required("Password is required"),
    });

    const handleDelete = async (password) =>
        await dispatch(deleteUser({ userid, password, token: jwt.token }));

    const formatError = (message) => {
        switch (message) {
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
        const { password } = values;
        await handleDelete(password);
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            <Formik
                initialValues={{
                    password: "",
                }}
                validationSchema={deleteSchema}
                validateOnBlur
                onSubmit={onSubmit}
            >
                <Card className={classes.formCard}>
                    <Form className={classes.form}>
                        <Typography variant="h4">Delete Account</Typography>
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
                            Delete
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
            </Formik>
        </div>
    );
}

export default ProfileDelete;
