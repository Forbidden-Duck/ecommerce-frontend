import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@material-ui/core/Badge";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness3Icon from "@material-ui/icons/Brightness3"; // Dark/Moon
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { logoutUser } from "../../store/auth/Auth.actions";
import { setDarkMode } from "../../store/site/Site.actions";
function Navbar() {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.site);
    const useStyles = makeStyles((theme) => ({
        menuButton: {
            marginRight: theme.spacing(2),
            display: "flex",
            alignItems: "center",
        },
        title: {
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
        },
        header: {
            justifyContent: "space-between",
            minHeight: 68,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
    }));
    const classes = useStyles();

    const BlueSwitch = withStyles({
        switchBase: {
            color: "#2791e8",
            "&$checked": {
                color: "#1e7cc9",
            },
            "&$checked + $track": {
                backgroundColor: "#1e7cc9",
            },
        },
        checked: {},
        track: { backgroundColor: "#b0b0b0" },
    })(Switch);
    const [themeSwitch, setThemeSwitch] = useState(darkMode);
    const handleThemeSwitch = () => {
        dispatch(setDarkMode(!darkMode));
        setThemeSwitch(!darkMode);
    };

    // Logged in/Profile Menu
    const [profileMenu, setProfileMenu] = useState(null);
    const handleProfileClose = () => {
        setProfileMenu(null);
    };
    const handleProfileClick = (evt) => {
        setProfileMenu(evt.currentTarget);
    };
    const handleLogout = async () => {
        handleProfileClose();
        await dispatch(logoutUser());
    };
    // Logged out/Site menu
    const [siteMenu, setSiteMenu] = useState(null);
    const handleSiteClose = () => {
        setSiteMenu(null);
    };
    const handleSiteClick = (evt) => {
        setSiteMenu(evt.currentTarget);
    };

    const { isAuthenticated } = useSelector((state) => state.auth);
    // TODO Cart items

    return (
        <AppBar position="static">
            <Toolbar className={classes.header}>
                <Typography
                    variant="h6"
                    className={classes.title}
                    component={Link}
                    to="/"
                >
                    Ecommerce Store
                </Typography>
                <div>
                    {!isAuthenticated ? (
                        <div className={classes.menuButton}>
                            <div>
                                <Typography
                                    style={{ paddingRight: 20 }}
                                    className={classes.title}
                                    component={Link}
                                    to="/login"
                                >
                                    Login
                                </Typography>
                                <Typography
                                    className={classes.title}
                                    component={Link}
                                    to="/register"
                                >
                                    Register
                                </Typography>
                            </div>
                            <div>
                                <IconButton
                                    aria-controls="site-select"
                                    aria-haspopup="true"
                                    onClick={handleSiteClick}
                                >
                                    <KeyboardArrowDownIcon
                                        style={{
                                            color: darkMode
                                                ? "#ccd2d4"
                                                : "#2f2f2f",
                                        }}
                                    />
                                </IconButton>
                                <Menu
                                    id="site-select"
                                    anchorEl={siteMenu}
                                    /* Popup appears below the site text*/
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    keepMounted
                                    open={Boolean(siteMenu)}
                                    onClose={handleSiteClose}
                                >
                                    <MenuItem>
                                        <Brightness3Icon
                                            style={{ color: "#4d4d4d" }}
                                            onClick={handleThemeSwitch}
                                        />
                                        <FormControlLabel
                                            value="title"
                                            control={
                                                <BlueSwitch
                                                    checked={themeSwitch}
                                                    onChange={handleThemeSwitch}
                                                />
                                            }
                                            label="Dark Mode"
                                            labelPlacement="start"
                                        />
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.menuButton}>
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
                                        max={99}
                                        color="secondary"
                                    >
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    aria-controls="profile-select"
                                    aria-haspopup="true"
                                    onClick={handleProfileClick}
                                >
                                    <AccountCircleIcon
                                        style={{
                                            color: darkMode
                                                ? "#ccd2d4"
                                                : "#2f2f2f",
                                        }}
                                    />
                                </IconButton>
                                <Menu
                                    id="profile-select"
                                    anchorEl={profileMenu}
                                    /* Popup appears below the profile text*/
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    keepMounted
                                    open={Boolean(profileMenu)}
                                    onClose={handleProfileClose}
                                >
                                    <MenuItem
                                        onClick={handleProfileClose}
                                        component={Link}
                                        to={"/profile"}
                                    >
                                        <PersonIcon
                                            style={{ color: "#4d4d4d" }}
                                        />
                                        <Typography style={{ paddingLeft: 10 }}>
                                            Profile
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleThemeSwitch}>
                                        <Brightness3Icon
                                            style={{ color: "#4d4d4d" }}
                                        />
                                        <Typography style={{ paddingLeft: 10 }}>
                                            Dark Mode
                                        </Typography>
                                        <BlueSwitch checked={themeSwitch} />
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ExitToAppIcon
                                            style={{ color: "#4d4d4d" }}
                                        />
                                        <Typography style={{ paddingLeft: 10 }}>
                                            Logout
                                        </Typography>
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
