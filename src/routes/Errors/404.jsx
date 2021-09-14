import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

function Fourzerofour() {
    const { darkMode } = useSelector((state) => state.site);

    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
        },
        text: {
            fontSize: "clamp(.9em, 3.6vw, 3em)",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
    }));
    const classes = useStyles();

    return (
        <div className={classes.app}>
            <Typography className={classes.text} variant="h3">
                Could not find the page you were looking for
            </Typography>
        </div>
    );
}

export default Fourzerofour;
