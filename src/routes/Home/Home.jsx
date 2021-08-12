import React from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Home() {
    const { authenticatedUser } = useSelector((state) => state.user);
    const { darkMode } = useSelector((state) => state.site);
    const glowColour = darkMode ? Array(3).fill("255") : Array(3).fill("0");

    const useStyles = makeStyles((theme) => ({
        section: {
            position: "relative",
            width: "100%",
            height: "100%",
            textAlign: "center",
            color: "#d7dee0",
        },
        background: {
            backgroundImage: "url(/images/sunsetBackground.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left",
            backgroundSize: "cover",
            position: "absolute",
            top: "20%",
            left: "-0.05%",
            width: "100%",
            height: "50%",
            border: `1px solid rgb(${glowColour})`,
            boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 20px rgba(${glowColour}, 1)`,
        },
        text: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -80%)",
        },
    }));
    const classes = useStyles();

    return (
        <section className={classes.section}>
            <div className={classes.background} />
            <Typography className={classes.text} variant="h1">
                Welcome
                {authenticatedUser &&
                    authenticatedUser.firstname &&
                    ` ${authenticatedUser.firstname}`}
            </Typography>
        </section>
    );
}

export default Home;
