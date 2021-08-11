import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, clearUserError } from "../../store/user/User.actions";
import "./Home.css";

function Home() {
    const dispatch = useDispatch();
    const { isAuthenticated, jwt } = useSelector((state) => state.auth);
    const { userid, user } = useSelector((state) => state.user);

    const handleGetUser = async (data) => {
        await dispatch(getUser(data));
        await dispatch(clearUserError());
    };

    const [hasUser, setHasUser] = useState(false);
    if (isAuthenticated && userid && !hasUser) {
        handleGetUser({ userid, token: jwt });
        setHasUser(true);
    }

    return (
        <section className="home-section">
            <h2>
                Welcome {hasUser && isAuthenticated && user && user.firstname}{" "}
                to the Ecommerce Store
            </h2>
            <p>This is the home page</p>
        </section>
    );
}

export default Home;
