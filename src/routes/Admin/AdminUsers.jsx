import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    withStyles,
    makeStyles,
    Button,
    Typography,
    Avatar,
} from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import {
    Gavel as GavelIcon,
    ArrowBack as GoBackIcon,
    Visibility as ViewIcon,
} from "@material-ui/icons";
import { getUsers } from "../../store/user/User.actions";

const tableColumns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "firstname", headerName: "First Name", width: 200 },
    { field: "lastname", headerName: "Last Name", width: 200 },
    { field: "admin", headerName: "Is Admin", width: 150 },
];

function AdminUsers() {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.site);

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

    const [users, setUsers] = useState([
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Bob",
            lastname: "John",
            admin: true,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "John",
            lastname: "Doe",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Harrison",
            lastname: "Howard",
            admin: true,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Michael",
            lastname: "Cox",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Mitchel",
            lastname: "Gavel",
            admin: true,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Diane",
            lastname: "Meginley",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Paul",
            lastname: "Meginley",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Wilson",
            lastname: "Fisk",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Lincoln",
            lastname: "Thompson",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Rory",
            lastname: "Bushell",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Steve",
            lastname: "Rogers",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Andre",
            lastname: "Latin",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Loki",
            lastname: "Odin-son",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Thor",
            lastname: "Odin-son",
            admin: true,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Michael",
            lastname: "Caine",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Jeremy",
            lastname: "Clarkson",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Owen",
            lastname: "Wilson",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Austin",
            lastname: "Powers",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Jeremy",
            lastname: "Renner",
            admin: false,
        },
        {
            _id: Math.floor(Math.random() * 999999999),
            firstname: "Tom",
            lastname: "Hiddleston",
            admin: false,
        },
    ]);

    useEffect(() => {
        dispatch(getUsers({ token: jwt.token }));
    }, [dispatch, jwt]);

    // useEffect(() => {
    //     // Filter out the logged in user
    //     setUsers(
    //         userCache
    //             ? Object.values(userCache).filter((user) => user._id !== userid)
    //             : false
    //     );
    // }, [userid, userCache, setUsers]);

    const [selected, setSelected] = useState("");
    const handleNewSelected = (model) => {
        setSelected(model[0]);
    };
    const handleViewClick = () => {
        alert(`/admin/user/${selected}`);
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
                        Go back
                    </Button>
                    {selected && (
                        <Button
                            style={{ marginLeft: "10px" }}
                            variant="contained"
                            color="primary"
                            startIcon={<ViewIcon />}
                            onClick={handleViewClick}
                        >
                            View User
                        </Button>
                    )}
                </div>
                {users && (
                    <div className={classes.gridWrapper}>
                        <DataGrid
                            className={classes.grid}
                            components={{ Toolbar: GridToolbar }}
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
