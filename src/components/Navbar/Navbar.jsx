import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Badge from "@material-ui/core/Badge";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { makeStyles } from "@material-ui/core/styles";

function Navbar() {
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        header: {
            justifyContent: "space-between",
            minHeight: 68,
            background: "#228B22",
        },
    }));
    const classes = useStyles();

    const { isAuthenticated } = useSelector((state) => state.auth);
    // TODO Cart items

    return (
        <AppBar position="static">
            <Toolbar className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                    Ecommerce Store
                </Typography>
                <div>
                    {!isAuthenticated && (
                        <Button color="inherit" component={Link} to={"/login"}>
                            Login
                        </Button>
                    )}
                    {isAuthenticated && (
                        <Typography variant="h6" className={classes.title}>
                            Logged in
                        </Typography>
                    )}
                    <IconButton
                        aria-label="Shopping Cart"
                        color="inherit"
                        component={Link}
                        to={"/cart"}
                    >
                        <Badge
                            badgeContent={0 /* TODO No cart items store */}
                            color="secondary"
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
