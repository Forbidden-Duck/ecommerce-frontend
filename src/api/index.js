import axios from "axios";

export default axios.create({
    baseURL: process.env.BASEURL || "http://localhost:6001/",
    withCredentials: true,
});
