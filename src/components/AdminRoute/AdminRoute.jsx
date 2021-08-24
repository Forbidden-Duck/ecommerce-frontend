import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromCache } from "../../store/user/User.actions";

function AdminRoute({ Component, ...rest }) {
    const dispatch = useDispatch();
    const { isAuthenticated, isPending, userid } = useSelector(
        (state) => state.auth
    );
    const { fetchedUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserFromCache(userid));
    }, [dispatch, userid]);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated || isPending) {
                    if (!fetchedUser || fetchedUser.admin)
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
