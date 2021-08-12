import React from "react";
import { useSelector } from "react-redux";
import "./Home.css";

function Home() {
    const { authenticatedUser } = useSelector((state) => state.user);
    const { darkMode } = useSelector((state) => state.site);
    return (
        <section
            className="home-section"
            style={{ color: darkMode ? "#ccd2d4" : "#2f2f2f" }}
        >
            <h2>
                Welcome {authenticatedUser && authenticatedUser.firstname} to
                the Ecommerce Store
            </h2>
            <p>This is the home page</p>
        </section>
    );
}

export default Home;
