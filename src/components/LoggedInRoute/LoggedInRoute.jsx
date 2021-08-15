import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

function LoggedInRoute({ component, ...rest }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default LoggedInRoute;
