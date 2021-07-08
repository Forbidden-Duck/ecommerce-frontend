import { combineReducers } from "redux";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
// TODO Other reducers

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers
});