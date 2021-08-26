import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ Component, ...rest }) {
    const { isAuthenticated, isPending } = useSelector((state) => state.auth);
    const { authedUser } = useSelector((state) => state.user);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated || isPending) {
                    if (!authedUser || authedUser.admin)
                        return <Component {...props} />;
                    else return <Redirect to={"/unauthorized"} />;
                } else
                    return (
                        <Redirect
                            to={`/login?redirect=${encodeURIComponent(
                                `${window.location.pathname}${window.location.search}`
                            )}`}
                        />
                    );
            }}
        />
    );
}

export default AdminRoute;
