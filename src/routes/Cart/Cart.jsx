import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    useHistory,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    makeStyles,
    Typography,
    Paper,
    Card,
    useMediaQuery,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogActions,
    Slide,
} from "@material-ui/core";
import {
    ShoppingCart as CheckoutIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import { getProducts } from "../../store/product/Product.actions";
import {
    updateCartItem,
    deleteCartItem,
    checkoutCart,
} from "../../store/cart/Cart.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";

const DialogTransition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

function Cart() {
    return (
        <Router>
            <Switch>
                <Route exact path="/cart" component={CartHome} />
                <Redirect from="*" to="/cart" />
            </Switch>
        </Router>
    );
}

function CartHome() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { darkMode } = useSelector((state) => state.site);
    const { isAuthenticated, jwt } = useSelector((state) => state.auth);
    const { authedCart, isPending } = useSelector((state) => state.cart);
    const { productCache } = useSelector((state) => state.product);

    const isSmall = useMediaQuery("(max-width:470px)");
    const isTiny = useMediaQuery("(max-width:390px)");

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            width: "100%",
        },
        // Paper
        paper: {
            margin: `50px ${isSmall ? "10px" : "50px"}`,
        },
        paperContent: {
            padding: "10px 10px 0px 10px",
        },
        paperFooter: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: "10px",
        },
        paperFooterTotal: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
        },
        // Card
        card: {
            height: "150px",
            marginBottom: "10px",
        },
        cardContent: {
            display: "flex",
            marginLeft: "10px",
        },
        cardImage: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "5%",
            margin: "10px 0px",
            width: "180px",
            height: "130px",
        },
        cardInfo: {
            margin: "8px",
            fontWeight: "500",
        },
        cardQty: {
            display: "flex",
            alignItems: "center",
        },
    }));
    const classes = useStyles();

    // Get products
    const [products, setProducts] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                await dispatch(getProducts({ token: jwt.token }));
                setProductsLoaded(true);
            }
        })();
    }, [dispatch, jwt, isAuthenticated, setProductsLoaded]);
    useEffect(() => {
        if (authedCart && productsLoaded) {
            const temp = [];
            for (const item of authedCart.items) {
                if (productCache[item.productid]) {
                    temp.push({
                        ...item,
                        productinfo: productCache[item.productid],
                    });
                } else {
                    dispatch(
                        deleteCartItem({
                            cartid: authedCart._id,
                            cartitemid: item._id,
                            token: jwt.token,
                        })
                    );
                }
            }
            setProducts(temp);
        }
    }, [authedCart, productCache, dispatch, jwt, productsLoaded]);

    // Card hover
    const [elevation, setElevation] = useState({});

    // Add quantity
    const handleAddQty = (cartid, itemid) => {
        return () => {
            const quantity = products.find(
                (item) => item._id === itemid
            ).quantity;
            if (quantity && !isPending) {
                dispatch(
                    updateCartItem({
                        cartid,
                        cartitemid: itemid,
                        cartitem: { quantity: quantity + 1 },
                        token: jwt.token,
                    })
                );
            }
        };
    };

    // Remove quantity
    const handleRemoveQty = (cartid, itemid) => {
        return () => {
            const quantity = products.find(
                (item) => item._id === itemid
            ).quantity;
            if (quantity && quantity > 1 && !isPending) {
                dispatch(
                    updateCartItem({
                        cartid,
                        cartitemid: itemid,
                        cartitem: { quantity: quantity - 1 },
                        token: jwt.token,
                    })
                );
            }
        };
    };

    // Delete item
    const handleDeleteItem = (cartid, itemid) => {
        return () => {
            if ((cartid, itemid)) {
                dispatch(
                    deleteCartItem({
                        cartid,
                        cartitemid: itemid,
                        token: jwt.token,
                    })
                );
            }
        };
    };

    // Checkout
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleCheckout = () => {
        if (products && products.length > 0 && dialogOpen === false) {
            history.push("/cart/checkout");
        } else {
            setDialogOpen(true);
        }
    };

    const handleClose = () => setDialogOpen(false);

    return (
        <div className={classes.app}>
            {authedCart && authedCart._id && (
                <Paper className={classes.paper} elevation={darkMode ? 10 : 24}>
                    <div className={classes.paperContent}>
                        {products.length > 0 ? (
                            products.map((item) => (
                                <Card
                                    key={item._id}
                                    className={classes.card}
                                    elevation={elevation[item._id] || 3}
                                    onMouseEnter={() =>
                                        setElevation({ [item._id]: 7 })
                                    }
                                    onMouseLeave={() =>
                                        setElevation({ [item._id]: 3 })
                                    }
                                >
                                    <div className={classes.cardContent}>
                                        {!isTiny && (
                                            <div
                                                className={classes.cardImage}
                                            />
                                        )}
                                        <div className={classes.cardInfo}>
                                            <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="h5"
                                            >
                                                {item.productinfo.name}
                                            </Typography>
                                            <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="body1"
                                            >
                                                {item.productinfo.price.toLocaleString(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }
                                                )}
                                            </Typography>
                                            <div className={classes.cardQty}>
                                                <Tooltip title="Add Quantity">
                                                    <IconButton
                                                        aria-label="add quantity"
                                                        size="small"
                                                        onClick={handleAddQty(
                                                            authedCart._id,
                                                            item._id
                                                        )}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography
                                                    style={{
                                                        border: "solid 1px gray",
                                                        borderRadius: "5px",
                                                        padding: "5px 10px",
                                                        margin: "0px 5px",
                                                    }}
                                                    variant="body1"
                                                >
                                                    {item.quantity}
                                                </Typography>
                                                <Tooltip title="Remove Quantity">
                                                    <IconButton
                                                        aria-label="remove quantity"
                                                        size="small"
                                                        onClick={handleRemoveQty(
                                                            authedCart._id,
                                                            item._id
                                                        )}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Item">
                                                    <IconButton
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
                                                        color="secondary"
                                                        aria-label="delete item"
                                                        size="small"
                                                        onClick={handleDeleteItem(
                                                            authedCart._id,
                                                            item._id
                                                        )}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Typography
                                style={{ textAlign: "center" }}
                                variant="h5"
                            >
                                No items in the cart
                            </Typography>
                        )}
                    </div>
                    <div className={classes.paperFooter}>
                        <div className={classes.paperFooterTotal}>
                            <Typography
                                style={{ marginRight: "5px" }}
                                variant="h5"
                            >
                                Sub-Total:
                            </Typography>
                            <Typography variant="body1">
                                {products
                                    .reduce(
                                        (acc, item) =>
                                            acc +
                                            item.quantity *
                                                item.productinfo.price,
                                        0
                                    )
                                    .toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </Typography>
                        </div>
                        <Button
                            style={{ width: "130px" }}
                            variant="contained"
                            color="primary"
                            to="/cart/checkout"
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                        <Dialog
                            open={dialogOpen}
                            TransitionComponent={DialogTransition}
                            onClose={handleClose}
                            keepMounted
                        >
                            <DialogTitle>{"No items in the cart"}</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    OK
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default Cart;
