import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Badge,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Switch,
    FormControlLabel,
    Drawer,
} from "@material-ui/core";
import {
    Menu as MenuIcon,
    ShoppingCart as ShoppingCartIcon,
    AccountCircle as AccountCircleIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Gavel as GavelIcon,
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
    ExitToApp as ExitToAppIcon,
    Brightness3 as Brightness3Icon, // Dark moon
} from "@material-ui/icons";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { logoutUser } from "../../store/auth/Auth.actions";
import {
    deleteUserFromCache,
    getUserFromCache,
} from "../../store/user/User.actions";
import { setDarkMode } from "../../store/site/Site.actions";

function Navbar({ isMobile }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    const { fetchedUser } = useSelector((state) => state.user);
    const { darkMode } = useSelector((state) => state.site);

    // Fetch the user
    useEffect(() => {
        dispatch(getUserFromCache(userid));
    }, [dispatch, userid]);

    const useStylesDesktop = makeStyles((theme) => ({
        menuButton: {
            marginRight: theme.spacing(2),
            display: "flex",
            alignItems: "center",
        },
        title: {
            color: "inherit",
            textDecoration: "none",
        },
        header: {
            justifyContent: "space-between",
            minHeight: 68,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
        buttonHover: {
            "&:hover": {
                color: "#8f8f8f !important",
            },
        },
    }));
    const classesDesktop = useStylesDesktop();
    const useStylesMobile = makeStyles((theme) => ({
        menuButton: {
            margin: theme.spacing(0.7),
        },
    }));
    const classesMobile = useStylesMobile();

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
        dispatch(deleteUserFromCache(userid));
        history.push("/");
    };
    const handleLogoutMobile = async () => {
        handleDrawer();
        await handleLogout();
    };
    // Logged out/Site menu
    const [siteMenu, setSiteMenu] = useState(null);
    const handleSiteClose = () => {
        setSiteMenu(null);
    };
    const handleSiteClick = (evt) => {
        setSiteMenu(evt.currentTarget);
    };

    // Mobile drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleDrawer = () => setDrawerOpen(!drawerOpen);

    // TODO Cart items

    const loginPath = `/login${location.search}`;
    const registerPath = `/register${location.search}`;
    return (
        <AppBar position="static">
            <Toolbar className={classesDesktop.header}>
                <Typography
                    variant="h6"
                    className={`${classesDesktop.title} ${classesDesktop.buttonHover}`}
                    component={Link}
                    to="/"
                >
                    Ecommerce Store
                </Typography>
                <div>
                    {isMobile ? (
                        <div style={{ display: "flex" }}>
                            {isAuthenticated && (
                                <div>
                                    <IconButton
                                        className={classesDesktop.buttonHover}
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
                            )}
                            <IconButton
                                aria-controls="site-select"
                                aria-haspopup="true"
                                onClick={handleDrawer}
                            >
                                <MenuIcon
                                    className={classesDesktop.buttonHover}
                                    style={{
                                        color: darkMode ? "#ccd2d4" : "#2f2f2f",
                                    }}
                                />
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={handleDrawer}
                            >
                                {!isAuthenticated ? (
                                    <div className={classesMobile.menuButton}>
                                        <div>
                                            <MenuItem
                                                onClick={handleDrawer}
                                                component={Link}
                                                to={loginPath}
                                            >
                                                <PersonIcon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Login
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleDrawer}
                                                component={Link}
                                                to={registerPath}
                                            >
                                                <PersonAddIcon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Register
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleThemeSwitch}
                                            >
                                                <Brightness3Icon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Dark Mode
                                                </Typography>
                                                <BlueSwitch
                                                    checked={themeSwitch}
                                                />
                                            </MenuItem>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {fetchedUser && fetchedUser.admin && (
                                            <MenuItem
                                                onClick={handleDrawer}
                                                component={Link}
                                                to={"/admin"}
                                            >
                                                <GavelIcon
                                                    style={{
                                                        color: "#4d4d4d",
                                                    }}
                                                />
                                                <Typography
                                                    style={{
                                                        paddingLeft: 10,
                                                    }}
                                                >
                                                    Admin
                                                </Typography>
                                            </MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={handleDrawer}
                                            component={Link}
                                            to={"/profile"}
                                        >
                                            <PersonIcon
                                                style={{ color: "#4d4d4d" }}
                                            />
                                            <Typography
                                                style={{ paddingLeft: 10 }}
                                            >
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleThemeSwitch}>
                                            <Brightness3Icon
                                                style={{ color: "#4d4d4d" }}
                                            />
                                            <Typography
                                                style={{ paddingLeft: 10 }}
                                            >
                                                Dark Mode
                                            </Typography>
                                            <BlueSwitch checked={themeSwitch} />
                                        </MenuItem>
                                        <MenuItem onClick={handleLogoutMobile}>
                                            <ExitToAppIcon
                                                style={{ color: "#4d4d4d" }}
                                            />
                                            <Typography
                                                style={{ paddingLeft: 10 }}
                                            >
                                                Logout
                                            </Typography>
                                        </MenuItem>
                                    </div>
                                )}
                            </Drawer>
                        </div>
                    ) : (
                        <div>
                            {!isAuthenticated ? (
                                <div className={classesDesktop.menuButton}>
                                    <div>
                                        <Typography
                                            style={{ paddingRight: 20 }}
                                            className={`${classesDesktop.title} ${classesDesktop.buttonHover}`}
                                            component={Link}
                                            to={loginPath}
                                        >
                                            Login
                                        </Typography>
                                        <Typography
                                            className={`${classesDesktop.title} ${classesDesktop.buttonHover}`}
                                            component={Link}
                                            to={registerPath}
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
                                                className={
                                                    classesDesktop.buttonHover
                                                }
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
                                                            checked={
                                                                themeSwitch
                                                            }
                                                            onChange={
                                                                handleThemeSwitch
                                                            }
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
                                <div className={classesDesktop.menuButton}>
                                    <div>
                                        <IconButton
                                            className={
                                                classesDesktop.buttonHover
                                            }
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
                                                className={
                                                    classesDesktop.buttonHover
                                                }
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
                                            {fetchedUser && fetchedUser.admin && (
                                                <MenuItem
                                                    onClick={handleProfileClose}
                                                    component={Link}
                                                    to={"/admin"}
                                                >
                                                    <GavelIcon
                                                        style={{
                                                            color: "#4d4d4d",
                                                        }}
                                                    />
                                                    <Typography
                                                        style={{
                                                            paddingLeft: 10,
                                                        }}
                                                    >
                                                        Admin
                                                    </Typography>
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                onClick={handleProfileClose}
                                                component={Link}
                                                to={"/profile"}
                                            >
                                                <PersonIcon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Profile
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleThemeSwitch}
                                            >
                                                <Brightness3Icon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Dark Mode
                                                </Typography>
                                                <BlueSwitch
                                                    checked={themeSwitch}
                                                />
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <ExitToAppIcon
                                                    style={{ color: "#4d4d4d" }}
                                                />
                                                <Typography
                                                    style={{ paddingLeft: 10 }}
                                                >
                                                    Logout
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
