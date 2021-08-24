import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

function Unauthorized() {
    const { darkMode } = useSelector((state) => state.site);

    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
        },
        imageContainer: {
            position: "relative",
            width: "30%",
            paddingBottom: "30%",
            float: "left",
            height: "0",
        },
        image: {
            backgroundImage: "url(/images/duckNo.gif)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
        },
        text: {
            fontSize: "clamp(.9em, 3.6vw, 3em)",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
    }));
    const classes = useStyles();

    return (
        <div className={classes.app}>
            <div className={classes.imageContainer}>
                <div className={classes.image} />
            </div>
            <Typography className={classes.text} variant="h3">
                You are unauthorized to view this page
            </Typography>
        </div>
    );
}

export default Unauthorized;
