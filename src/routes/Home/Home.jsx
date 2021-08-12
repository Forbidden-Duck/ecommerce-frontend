import React from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "./Home.css";

function Home() {
    const { authenticatedUser } = useSelector((state) => state.user);
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

    return (
        <section className="home-section">
            <div className={classes.background} />
            <Typography className="home-text" variant="h1">
                Welcome
                {authenticatedUser &&
                    authenticatedUser.firstname &&
                    ` ${authenticatedUser.firstname}`}
            </Typography>
        </section>
    );
}

export default Home;
