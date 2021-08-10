import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@material-ui/core/Badge";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import { logoutUser } from "../../store/auth/Auth.actions";

function Navbar() {
    const dispatch = useDispatch();
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

    const [profileMenu, setProfileMenu] = useState(null);
    const handleProfileClick = (evt) => {
        setProfileMenu(evt.currentTarget);
    };
    const handleProfileClose = () => {
        setProfileMenu(null);
    };
    const handleLogout = async () => {
        handleProfileClose();
        await dispatch(logoutUser());
    };

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
                        <div>
                            <IconButton
                                aria-label="Shopping Cart"
                                color="inherit"
                                component={Link}
                                to={"/cart"}
                            >
                                <Badge
                                    badgeContent={
                                        0 /* TODO No cart items store */
                                    }
                                    color="secondary"
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <div>
                                <IconButton
                                    aria-controls="profile-select"
                                    aria-haspopup="true"
                                    onClick={handleProfileClick}
                                >
                                    <AccountCircleIcon
                                        style={{ color: "white" }}
                                    />
                                </IconButton>
                                <Menu
                                    id="profile-select"
                                    anchorEl={profileMenu}
                                    keepMounted
                                    open={Boolean(profileMenu)}
                                    onClose={handleProfileClose}
                                >
                                    <MenuItem
                                        onClick={handleProfileClose}
                                        componenet={Link}
                                        to={"/profile"}
                                    >
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
