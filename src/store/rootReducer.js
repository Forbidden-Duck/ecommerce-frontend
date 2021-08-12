import { combineReducers } from "redux";
import SiteReducers from "./site/Site.reducers";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
// TODO Other reducers

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers,
    site: SiteReducers,
});
