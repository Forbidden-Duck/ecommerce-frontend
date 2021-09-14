import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useMediaQuery } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import {
    ArrowBack as GoBackIcon,
    Visibility as ViewIcon,
} from "@material-ui/icons";
import { getUsers } from "../../../store/user/User.actions";
import { findOrders } from "../../../store/order/Order.actions";
import Button from "../../../components/Button/Button";

const tableColumns = [
    { field: "id", headerName: "ID", width: 150 },
    {
        field: "fullname",
        headerName: "User's Name",
        width: 200,
    },
    {
        field: "status",
        headerName: "Status",
        width: 150,
    },
    {
        field: "total",
        headerName: "Total",
        width: 200,
    },
    {
        field: "items",
        headerName: "Items",
        width: 115,
    },
];

function AdminOrders() {
    const dispatch = useDispatch();
    // is too smal
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

    const { jwt } = useSelector((state) => state.auth);
    const { orderCache } = useSelector((state) => state.order);
    const { userCache } = useSelector((state) => state.user);

    const [orders, setOrders] = useState([]);

    // Get users
    useEffect(() => {
        dispatch(getUsers({ token: jwt.token }));
    }, [dispatch, jwt]);

    // Get orders
    useEffect(() => {
        dispatch(findOrders({ userid: "*", token: jwt.token }));
    }, [dispatch, jwt]);

    // Set orders
    useEffect(() => {
        if (orderCache && userCache) {
            setOrders(
                Object.values(orderCache)
                    .reverse()
                    .map((order) => ({
                        id: order._id,
                        fullname:
                            userCache[order.userid]?.firstname &&
                            userCache[order.userid]?.lastname
                                ? `${userCache[order.userid].firstname} ${
                                      userCache[order.userid].lastname
                                  }`
                                : "Deleted Account",
                        status: order.status,
                        total:
                            order.total?.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            }) || `$0`,
                        items: order.items.length,
                    }))
            );
        }
    }, [setOrders, orderCache, userCache]);

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
                            to={`/admin/order/${selected}`}
                        >
                            {isTooSmall ? "View" : "View Order"}
                        </Button>
                    )}
                </div>
                {orders && (
                    <div className={classes.gridWrapper}>
                        <DataGrid
                            className={classes.grid}
                            components={{
                                Toolbar: !isTooSmall && GridToolbar,
                            }}
                            columns={tableColumns}
                            rows={orders}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onSelectionModelChange={handleNewSelected}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOrders;
