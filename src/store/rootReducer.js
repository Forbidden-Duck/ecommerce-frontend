import { combineReducers } from "redux";
import SiteReducers from "./site/Site.reducers";
import AuthReducers from "./auth/Auth.reducers";
import UserReducers from "./user/User.reducers";
import ProductReducers from "./product/Product.reducers";
import CartReducers from "./cart/Cart.reducers";
// TODO Other reducers

export default combineReducers({
    auth: AuthReducers,
    user: UserReducers,
    product: ProductReducers,
    cart: CartReducers,
    site: SiteReducers,
});
