import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    makeStyles,
    withStyles,
    Typography,
    useMediaQuery,
    Grid,
    Card,
    Chip,
} from "@material-ui/core";
import {
    AttachMoney as DollarIcon,
    Person as LoginIcon,
    PersonAdd as RegisterIcon,
    ShoppingCart as CartIcon,
} from "@material-ui/icons";
import { getProducts } from "../../store/product/Product.actions";
import { addCartItem, updateCartItem } from "../../store/cart/Cart.actions";
import Button from "../../components/Button/Button";

function Products() {
    const dispatch = useDispatch();

    const { darkMode } = useSelector((state) => state.site);
    const { isAuthenticated, jwt } = useSelector((state) => state.auth);
    const { authedCart } = useSelector((state) => state.cart);
    const { productCache } = useSelector((state) => state.product);

    const isSmall = useMediaQuery("(max-width:550px)");

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
        },
        // Grid
        gridRoot: {
            flexGrow: 1,
            maxWidth: "90%",
            maxHeight: "100%",
            marginTop: "80px",
            marginBottom: "10px",
        },
        card: {
            width: "250px",
            height: "300px",
            position: "relative",
        },
        cardContent: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            height: "300px",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
        },
        cardHeader: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5px",
        },
        cardPfp: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "10%",
            margin: "10px 0px",
            width: "150px",
            height: "100px",
        },
        cardFooter: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: ".7rem",
            textAlign: "left",
            color: "#787878",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginBottom: "10px",
            marginLeft: "50px",
        },
        // Not authenticated
        headerText: {
            fontSize: "clamp(.9em, 3.6vw, 3em)",
            color: darkMode ? "#ccd2d4" : "#2f2f2f",
        },
        headerButtons: {
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
        },
    }));
    const classes = useStyles();
    const DollarChip = withStyles({
        icon: {
            marginRight: "-15px",
        },
    })(Chip);

    const [products, setProducts] = useState([]);
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProducts({ token: jwt.token }));
        }
    }, [dispatch, jwt, isAuthenticated]);
    useEffect(() => {
        setProducts(productCache ? Object.values(productCache) : []);
    }, [productCache, setProducts]);

    const formatDescription = (description) => {
        if (description.length > 125) {
            return description.substr(0, 122) + "...";
        }
        return description;
    };

    const handleAddToCart = (cart, product) => {
        if (cart) {
            let cartitem = cart.items.find(
                (item) => item.productid === product._id
            );
            if (cartitem && cartitem._id) {
                cartitem = {
                    ...cartitem,
                };
                cartitem.quantity++;
                return () => {
                    dispatch(
                        updateCartItem({
                            cartid: cart._id,
                            cartitemid: cartitem._id,
                            token: jwt.token,
                            cartitem,
                        })
                    );
                };
            } else {
                cartitem = {
                    productid: product._id,
                    quantity: 1,
                    price: product.price,
                };
                return () => {
                    dispatch(
                        addCartItem({
                            cartid: cart._id,
                            token: jwt.token,
                            cartitem,
                        })
                    );
                };
            }
        }
    };

    return (
        <div className={classes.app}>
            {isAuthenticated ? (
                <>
                    {products.length > 0 ? (
                        <>
                            <Grid
                                className={classes.gridRoot}
                                container
                                spacing={2}
                            >
                                <Grid xs={12} item>
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={3}
                                    >
                                        {products.map((product) => (
                                            <Grid key={product._id} item>
                                                <Card className={classes.card}>
                                                    <div
                                                        className={
                                                            classes.cardContent
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                classes.cardPfp
                                                            }
                                                        />
                                                        <div
                                                            className={
                                                                classes.cardHeader
                                                            }
                                                        >
                                                            <Typography
                                                                style={{
                                                                    marginRight:
                                                                        "5px",
                                                                }}
                                                                variant="h5"
                                                            >
                                                                {product.name}
                                                            </Typography>
                                                            <DollarChip
                                                                icon={
                                                                    <DollarIcon />
                                                                }
                                                                color="primary"
                                                                label={
                                                                    <Typography variant="body1">
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </Typography>
                                                                }
                                                            />
                                                        </div>
                                                        <Typography
                                                            style={{
                                                                paddingLeft:
                                                                    "5px",
                                                                paddingRight:
                                                                    "5px",
                                                            }}
                                                            variant="body2"
                                                        >
                                                            {formatDescription(
                                                                product.description
                                                            )}
                                                        </Typography>
                                                        <div
                                                            className={
                                                                classes.cardFooter
                                                            }
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={
                                                                    <CartIcon />
                                                                }
                                                                onClick={handleAddToCart(
                                                                    authedCart,
                                                                    product
                                                                )}
                                                            >
                                                                Add to Cart
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Typography
                            style={{ marginTop: "50px" }}
                            className={classes.headerText}
                            variant="h3"
                        >
                            There are no products to view
                        </Typography>
                    )}
                </>
            ) : (
                <div style={{ marginTop: "50px" }}>
                    <Typography className={classes.headerText} variant="h3">
                        You must be logged in to view products
                    </Typography>
                    <div className={classes.headerButtons}>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="primary"
                            startIcon={<LoginIcon />}
                            size={isSmall ? "small" : "medium"}
                            component={Link}
                            to={`/login?redirect=${encodeURIComponent(
                                "/products"
                            )}`}
                        >
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<RegisterIcon />}
                            size={isSmall ? "small" : "medium"}
                            component={Link}
                            to={`/register?redirect=${encodeURIComponent(
                                "/products"
                            )}`}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
