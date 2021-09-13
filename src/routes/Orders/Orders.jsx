import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    makeStyles,
    Typography,
    Paper,
    Card,
    useMediaQuery,
} from "@material-ui/core";
import { Visibility as ViewIcon } from "@material-ui/icons";
import { getProducts } from "../../store/product/Product.actions";
import { findOrders } from "../../store/order/Order.actions";
import Button from "../../components/Button/Button";
import { useCallbackResize } from "../../hooks/useCallbackResize";

function Orders() {
    const dispatch = useDispatch();

    const { darkMode } = useSelector((state) => state.site);
    const { userid, isAuthenticated, jwt } = useSelector((state) => state.auth);
    const { productCache } = useSelector((state) => state.product);
    const { orderCache } = useSelector((state) => state.order);

    const isSmall = useMediaQuery("(max-width:470px)");
    const isTiny = useMediaQuery("(max-width:390px)");

    const useStyles = makeStyles((theme) => ({
        // Paper
        paper: {
            margin: `50px ${isSmall ? "0px" : "40px"}`,
        },
        paperContent: {
            padding: "10px",
        },
        // Card
        card: {
            height: "150px",
            marginBottom: "10px",
        },
        cardContent: {
            display: "flex",
            marginLeft: "10px",
            "& h6": {
                fontSize: "1.25em",
            },
        },
        cardImage: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "5%",
            margin: "10px 0px",
            width: "178px",
            height: "130px",
        },
        cardInfo: {
            margin: "8px",
            fontWeight: "500",
        },
        cardItems: {
            display: "flex",
            alignItems: "center",
            "& p": {
                marginTop: "3px", // Was not aligned properly
            },
        },
        cardButtons: {
            display: "flex",
        },
    }));
    const classes = useStyles();

    // Get products
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProducts({ token: jwt.token }));
        }
    }, [dispatch, jwt, isAuthenticated]);

    // Get orders
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(findOrders({ token: jwt.token }));
        }
    }, [dispatch, jwt, isAuthenticated]);

    // Card hover
    const [elevation, setElevation] = useState({});
    const orders = Object.values(orderCache).reverse(); // Show newest first

    const [winDim, setWinDim] = useState({ width: 0, height: 0 });

    const handleResize = () => {
        setWinDim({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    useCallbackResize(handleResize);

    return (
        <>
            <Paper className={classes.paper} elevation={darkMode ? 10 : 24}>
                <div className={classes.paperContent}>
                    {orders.length > 0 ? (
                        orders.map((item) => (
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
                                        <div className={classes.cardImage} />
                                    )}
                                    <div className={classes.cardInfo}>
                                        <div className={classes.cardItems}>
                                            <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="h6"
                                            >
                                                Items:&nbsp;
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontWeight: "500",
                                                    fontSize: "1.07em",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    width: `${
                                                        isTiny
                                                            ? winDim.width - 130
                                                            : isSmall
                                                            ? winDim.width - 310
                                                            : winDim.width - 390
                                                    }px`,
                                                }}
                                                variant="h6"
                                            >
                                                {Object.values(item.items).map(
                                                    (orderitem, i, arr) => (
                                                        <>
                                                            {productCache[
                                                                orderitem
                                                                    .productid
                                                            ]
                                                                ? productCache[
                                                                      orderitem
                                                                          .productid
                                                                  ].name
                                                                : "Loading Item..."}
                                                            {i <
                                                                arr.length -
                                                                    1 && ", "}
                                                        </>
                                                    )
                                                )}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardItems}>
                                            <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="h6"
                                            >
                                                Total:&nbsp;
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontWeight: "500",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    width: `${
                                                        isTiny
                                                            ? winDim.width - 130
                                                            : isSmall
                                                            ? winDim.width - 310
                                                            : winDim.width - 390
                                                    }px`,
                                                }}
                                                variant="body1"
                                            >
                                                {item.total.toLocaleString(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }
                                                )}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardItems}>
                                            <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="h6"
                                            >
                                                Status:&nbsp;
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontWeight: "500",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    width: `${
                                                        isTiny
                                                            ? winDim.width - 130
                                                            : isSmall
                                                            ? winDim.width - 310
                                                            : winDim.width - 390
                                                    }px`,
                                                }}
                                                variant="body1"
                                            >
                                                {item.status}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardButtons}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ViewIcon />}
                                                component={Link}
                                                to={`/order/${item._id}`}
                                            >
                                                View Order
                                            </Button>
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
                            You have no orders
                        </Typography>
                    )}
                </div>
            </Paper>
        </>
    );
}

export default Orders;
