import { combineReducers } from "redux";
import AuthReducers from "./auth/Auth.reducers";
// TODO Other reducers

export default combineReducers({
    auth: AuthReducers
});