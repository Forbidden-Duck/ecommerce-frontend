import { combineReducers } from "redux";
import SiteReducers from "./site/Site.reducers";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
import ProductReducers from "./product/Product.reducers";
// TODO Other reducers

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers,
    product: ProductReducers,
    site: SiteReducers,
});
