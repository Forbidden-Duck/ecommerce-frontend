import React, { useEffect } from "react";
import { getUserFromCache } from "../../store/user/User.actions";
import { useDispatch, useSelector } from "react-redux";
import ReactRotatingText from "react-rotating-text";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "./Home.css";

function Home() {
    const { darkMode } = useSelector((state) => state.site);
    const glowColour = darkMode ? Array(3).fill("255") : Array(3).fill("0");

    const useStyles = makeStyles((theme) => ({
        background: {
            backgroundImage: "url(/images/sunsetBackground.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            position: "absolute",
            top: "20%",
            width: "100%",
            height: "50%",
            boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 20px rgba(${glowColour}, 1)`,
        },
    }));
    const classes = useStyles();

    // Get user from cache
    const dispatch = useDispatch();
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    const { fetchedUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserFromCache(userid));
    }, [dispatch, userid]);

    return (
        <section
            className="home-section"
            style={{ background: darkMode ? "#292929" : "#f2f2f2" }}
        >
            <div className={classes.background} />
            <Typography className="home-text" variant="h1">
                {isAuthenticated && fetchedUser && (
                    <ReactRotatingText
                        items={[`Welcome ${fetchedUser.firstname}`]}
                        pause={
                            3153999999999.88916
                        } /* Wait 1 century before typing again :) */
                        typingInterval={120}
                    />
                )}
                {!isAuthenticated && (
                    <ReactRotatingText
                        items={["Welcome"]}
                        pause={
                            3153999999999.88916
                        } /* Wait 1 century before typing again :) */
                        typingInterval={150}
                    />
                )}
            </Typography>
        </section>
    );
}

export default Home;
