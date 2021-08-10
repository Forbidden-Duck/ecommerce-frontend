import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_BASEURL || "http://localhost:6001/",
    withCredentials: true,
});
