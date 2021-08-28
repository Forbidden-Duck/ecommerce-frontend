import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
    InputAdornment,
    IconButton,
    Typography,
    Card,
    FormControlLabel,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    getUserFromCache,
    getUser,
    updateUser,
    clearUserError,
} from "../../store/user/User.actions";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import CheckboxField from "../../components/CheckboxField/CheckboxField";

function AdminEditUser() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { userid } = useParams();

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

    const { jwt } = useSelector((state) => state.auth);
    const { fetchedUser, error, isPending } = useSelector(
        (state) => state.user
    );

    const [user, setUser] = useState({
        firstname: "Loading...",
        lastname: "Loading...",
        email: "Loading...",
        admin: false,
    });
    const [checked, setChecked] = useState(user.admin);
    const handleCheckedClick = () => setChecked(!checked);

    useEffect(() => {
        dispatch(clearUserError());
        (async () => {
            await dispatch(getUser({ userid: userid, token: jwt.token }));
            dispatch(getUserFromCache(userid));
        })();
    }, [dispatch, userid, jwt]);

    useEffect(() => {
        setUser(
            fetchedUser?._id === userid
                ? {
                      firstname: fetchedUser.firstname,
                      lastname: fetchedUser.lastname,
                      email: fetchedUser.email,
                      admin: fetchedUser.admin,
                  }
                : {
                      firstname: "Loading...",
                      lastname: "Loading...",
                      email: "Loading...",
                      admin: false,
                  }
        );
        setChecked(fetchedUser?._id === userid ? fetchedUser.admin : false);
    }, [userid, fetchedUser]);

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
            admin: Yup.bool(),
        })
        .test("oneExists", null, (user) => {
            if (
                user.email ||
                user.firstname ||
                user.lastname ||
                user.admin !== fetchedUser.admin
            ) {
                return true;
            }
            return new Yup.ValidationError(
                "Must edit at least 1 field",
                null,
                "oneExists"
            );
        });

    const handleSave = async (user, password) => {
        for (const [key, value] of Object.entries(user)) {
            // Delete the empty strings
            if (typeof value === "string" && !value) {
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
            case "You can not add admin=false to the body":
                return "You can not remove an admin's status";
            default:
                return message;
        }
    };

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push(`/admin/user/${userid}`);
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit, userid]);

    const onSubmit = async (values) => {
        const { email, firstname, lastname, password, admin } = values;
        await handleSave({ email, firstname, lastname, admin }, password);
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            {fetchedUser && (
                <Formik
                    initialValues={{
                        email: "",
                        firstname: "",
                        lastname: "",
                        password: "",
                        admin: false,
                    }}
                    validationSchema={editSchema}
                    validateOnBlur
                    onSubmit={onSubmit}
                >
                    {(formProps) => (
                        <Card className={classes.formCard}>
                            <Form className={classes.form}>
                                <Typography variant="h4">
                                    {fetchedUser?.admin
                                        ? "Can not edit an admin"
                                        : "Edit User"}
                                </Typography>
                                <TextField
                                    label="Email"
                                    name="email"
                                    id="email-input"
                                    autoComplete="email"
                                    placeholder={user.email}
                                    disabled={fetchedUser?.admin}
                                />
                                <TextField
                                    label="First name"
                                    name="firstname"
                                    id="firstname-input"
                                    autoComplete="given-name"
                                    placeholder={user.firstname}
                                    disabled={fetchedUser?.admin}
                                />
                                <TextField
                                    label="Last name"
                                    name="lastname"
                                    id="lastname-input"
                                    autoComplete="family-name"
                                    placeholder={user.lastname}
                                    disabled={fetchedUser?.admin}
                                />
                                <div>
                                    <FormControlLabel
                                        label="Admin"
                                        labelPlacement="start"
                                        control={
                                            <CheckboxField
                                                name="admin"
                                                checked={checked}
                                                onClick={handleCheckedClick}
                                                color="primary"
                                                inputProps={{
                                                    "aria-label":
                                                        "primary checkbox",
                                                }}
                                                disabled={fetchedUser?.admin}
                                            />
                                        }
                                    />
                                </div>
                                {formProps.errors.oneExists && (
                                    <div
                                        style={{
                                            marginTop: "-20px",
                                        }}
                                    >
                                        {formProps.errors.oneExists}
                                    </div>
                                )}
                                <TextField
                                    style={{
                                        marginTop: "30px",
                                    }}
                                    label="Password"
                                    name="password"
                                    id="password-input"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    disabled={fetchedUser?.admin}
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
                                    disabled={fetchedUser?.admin}
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
                                    to={`/admin/user/${userid}`}
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

export default AdminEditUser;
