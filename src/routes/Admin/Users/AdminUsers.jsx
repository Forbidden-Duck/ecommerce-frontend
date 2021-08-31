import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Button, useMediaQuery } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import {
    ArrowBack as GoBackIcon,
    Visibility as ViewIcon,
} from "@material-ui/icons";
import { getUsers } from "../../../store/user/User.actions";

const tableColumns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "firstname", headerName: "First Name", width: 200 },
    { field: "lastname", headerName: "Last Name", width: 200 },
    { field: "admin", headerName: "Is Admin", width: 150 },
];

function AdminUsers() {
    const dispatch = useDispatch();
    // is too small
    const isTooSmall = useMediaQuery("(max-width:415px)");

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
        },
        contentWrapper: {
            marginTop: "50px",
            marginBottom: "50px",
            position: "relative",
            maxWidth: "80%",
            width: "100%",
        },
        buttonWrapper: {
            position: "absolute",
            left: "0",
        },
        gridWrapper: {
            marginTop: "60px",
            display: "flex",
            flexFlow: "row wrap",
            height: "70vh",
        },
        grid: {
            background: "white",
            color: "inherit",
        },
    }));
    const classes = useStyles();

    const { userid, jwt } = useSelector((state) => state.auth);
    const { userCache } = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        dispatch(getUsers({ token: jwt.token }));
    }, [dispatch, jwt]);

    useEffect(() => {
        // Filter out the logged in user
        setUsers(userCache ? Object.values(userCache) : false);
    }, [userid, userCache, setUsers]);

    const [selected, setSelected] = useState("");
    const handleNewSelected = (model) => {
        setSelected(model[0]);
    };

    return (
        <div className={classes.app}>
            <div className={classes.contentWrapper}>
                <div className={classes.buttonWrapper}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<GoBackIcon />}
                        component={Link}
                        to="/admin"
                    >
                        {isTooSmall ? "Back" : "Go back"}
                    </Button>
                    {selected && (
                        <Button
                            style={{ marginLeft: "10px" }}
                            variant="contained"
                            color="primary"
                            startIcon={<ViewIcon />}
                            component={Link}
                            to={`/admin/user/${selected}`}
                        >
                            {isTooSmall ? "View" : "View User"}
                        </Button>
                    )}
                </div>
                {users && (
                    <div className={classes.gridWrapper}>
                        <DataGrid
                            className={classes.grid}
                            components={{
                                Toolbar: !isTooSmall && GridToolbar,
                            }}
                            columns={tableColumns}
                            rows={users.map((user) => ({
                                id: user._id,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                admin: user.admin ? "Yes" : "No",
                            }))}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onSelectionModelChange={handleNewSelected}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
