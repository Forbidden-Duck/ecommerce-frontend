import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

function LoggedInRoute({ Component, ...rest }) {
    const { isAuthenticated, isPending } = useSelector((state) => state.auth);
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated || isPending ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default LoggedInRoute;
