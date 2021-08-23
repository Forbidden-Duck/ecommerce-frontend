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
import { updateUser, clearUserError } from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

function ProfileEditPassword() {
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
    const { fetchedUser, error, isPending } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(clearUserError());
    }, [dispatch, userid]);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowNewPassword = () =>
        setShowNewPassword(!showNewPassword);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const editSchema = Yup.object().shape({
        newPassword: Yup.string().required("New Password is required"),
        newPasswordConfirm: Yup.string().oneOf(
            [Yup.ref("newPassword"), null],
            "New password does not match"
        ),
        password: Yup.string().required("Password is required"),
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

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push("/profile");
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit]);

    const onSubmit = async (values) => {
        const { newPassword, password } = values;
        await handleSave({ password: newPassword }, password);
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            {fetchedUser && (
                <Formik
                    initialValues={{
                        newPassword: "",
                        newPasswordConfirm: "",
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
                                    label="New Password"
                                    name="newPassword"
                                    id="newpassword-input"
                                    type={showNewPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowNewPassword
                                                    }
                                                >
                                                    {showNewPassword ? (
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
                                    label="Confirm New Password"
                                    name="newPasswordConfirm"
                                    id="newpasswordconfirm-input"
                                    type={showNewPassword ? "text" : "password"}
                                    autoComplete="off"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowNewPassword
                                                    }
                                                >
                                                    {showNewPassword ? (
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
                                    to={"/profile/edit"}
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

export default ProfileEditPassword;
