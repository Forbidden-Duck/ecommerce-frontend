import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    Link,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import {
    Person as PersonIcon,
    LocalMall as ProductIcon,
    CreditCard as OrderIcon,
} from "@material-ui/icons";
import { Button } from "@material-ui/core";

// Users Components
import AdminUsers from "./Users/AdminUsers";
import AdminViewUser from "./Users/AdminViewUser";
import AdminEditUser from "./Users/AdminEditUser";
import AdminDeleteUser from "./Users/AdminDeleteUser";

// Products Components
import AdminProducts from "./Products/AdminProducts";
import AdminCreateProduct from "./Products/AdminCreateProduct";
import AdminViewProduct from "./Products/AdminViewProduct";
import AdminEditProduct from "./Products/AdminEditProduct";
import AdminDeleteProduct from "./Products/AdminDeleteProduct";

// Orders Components
import AdminOrders from "./Orders/AdminOrders";

function Admin() {
    return (
        <Router>
            <Switch>
                <Route exact path="/admin" component={AdminHome} />

                {/* Users Routes */}
                <Route exact path="/admin/users" component={AdminUsers} />
                <Route
                    exact
                    path="/admin/user/:userid"
                    component={AdminViewUser}
                />
                <Route
                    exact
                    path="/admin/user/:userid/edit"
                    component={AdminEditUser}
                />
                <Route
                    exact
                    path="/admin/user/:userid/delete"
                    component={AdminDeleteUser}
                />

                {/* Products Routes */}
                <Route exact path="/admin/products" component={AdminProducts} />
                <Route
                    exact
                    path="/admin/products/create"
                    component={AdminCreateProduct}
                />
                <Route
                    exact
                    path="/admin/product/:productid"
                    component={AdminViewProduct}
                />
                <Route
                    exact
                    path="/admin/product/:productid/edit"
                    component={AdminEditProduct}
                />
                <Route
                    exact
                    path="/admin/product/:productid/delete"
                    component={AdminDeleteProduct}
                />

                {/* Orders Routes */}
                <Route exact path="/admin/orders" component={AdminOrders} />

                {/* Users Redirects */}
                <Redirect from="/admin/user" to="/admin/users" />
                <Redirect from="/admin/users/*" to="/admin/users" />
                {/* Products Redirects */}
                <Redirect from="/admin/product" to="/admin/products" />
                <Redirect from="/admin/products/*" to="/admin/products" />
                {/* Orders Redirects */}
                <Redirect from="/admin/order" to="/admin/orders" />
                <Redirect from="/admin/orders/*" to="/admin/orders" />
                <Redirect from="*" to="/admin" />
            </Switch>
        </Router>
    );
}

function AdminHome() {
    const { darkMode } = useSelector((state) => state.site);
    const isSmall = useMediaQuery("(max-width:550px)");

    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "99.83vw",
            height: "92.5vh",
        },
        text: {
            fontSize: "clamp(2.3em, 10vw, 4em)",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
        button: {
            marginRight: "5px",
        },
    }));
    const classes = useStyles();

    const { userid } = useSelector((state) => state.auth);
    const { authedUser } = useSelector((state) => state.user);

    const [firstName, setFirstName] = useState("Loading...");

    useEffect(() => {
        setFirstName(
            authedUser?._id === userid ? authedUser.firstname : "Loading..."
        );
    }, [userid, authedUser]);

    return (
        <div className={classes.app}>
            <Typography className={classes.text} variant="h3">
                Hello {firstName}
            </Typography>
            {firstName !== "Loading..." && (
                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        startIcon={<PersonIcon />}
                        size={isSmall ? "small" : "medium"}
                        component={Link}
                        to="/admin/users"
                    >
                        Users
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        startIcon={<ProductIcon />}
                        size={isSmall ? "small" : "medium"}
                        component={Link}
                        to="/admin/products"
                    >
                        Products
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        startIcon={<OrderIcon />}
                        size={isSmall ? "small" : "medium"}
                        component={Link}
                        to="/admin/orders"
                    >
                        Orders
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Admin;
