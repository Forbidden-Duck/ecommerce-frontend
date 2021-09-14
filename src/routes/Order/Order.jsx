import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, makeStyles } from "@material-ui/core";
import {
    ArrowBack as GoBackIcon,
    Launch as LinkIcon,
} from "@material-ui/icons";
import { getOrder, getOrderFromCache } from "../../store/order/Order.actions";
import Button from "../../components/Button/Button";

function Order() {
    const dispatch = useDispatch();
    const { orderid } = useParams();

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "75px 0px",
        },
        buttonWrapper: {
            width: "350px",
            marginBottom: "5px",
        },
        error: {
            background: "rgba(255,0,0,.5)",
            width: "100%",
            fontWeight: 500,
        },
        // Card Content
        card: {
            width: "350px",
            position: "relative",
        },
        cardContent: {
            flexDirection: "column",
            textAlign: "center",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
            marginBottom: "40px",
        },
        cardField: {
            display: "flex",
            alignItems: "center",
            marginLeft: "25px",
            fontWeight: "500",
            "& p": {
                marginTop: "3px",
            },
        },
        cardCenterWrapper: {
            display: "flex",
            justifyContent: "center",
        },
        cardPfp: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "5%",
            margin: "10px 0px",
            width: "300px",
            height: "200px",
        },
        cardItem: {
            margin: "10px 25px",
        },
        cardItemPfp: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "5%",
            margin: "5px 10px",
            width: "100px",
            height: "90px",
        },
        cardItemContent: {
            display: "flex",
            margin: "10px 0px",
        },
        cardItemField: {
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
            marginLeft: "5px",
            fontWeight: "500",
            "& h6": {
                fontSize: "1.1em",
            },
            "& p": {
                marginTop: "2px",
            },
        },
        cardFooter: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: ".7rem",
            textAlign: "left",
            color: "#787878",
            position: "absolute",
            bottom: "0",
            left: "0",
            marginLeft: "10px",
        },
        "@media (max-width:350px)": {
            card: {
                width: "100vw",
            },
            buttonWrapper: {
                width: "100vw",
            },
            cardItemField: {
                marginTop: "0px",
                marginLeft: "15px",
            },
            cardItemPfp: {
                display: "none",
                visibility: "hidden",
            },
        },
        "@media (max-width:540px)": {
            app: {
                margin: "0px 0px",
            },
        },
    }));
    const classes = useStyles();

    const { jwt } = useSelector((state) => state.auth);
    const { fetchedOrder, error } = useSelector((state) => state.order);
    const { productCache } = useSelector((state) => state.product);

    const [order, setOrder] = useState({
        status: "Loading...",
        total: 0,
        items: [],
        receipt: false,
        cardBrand: "Loading...",
        cardLast4: "0000",
        createdAt: "Loading...",
    });

    useEffect(() => {
        (async () => {
            await dispatch(getOrder({ orderid, token: jwt.token }));
            dispatch(getOrderFromCache(orderid));
        })();
    }, [dispatch, orderid, jwt]);

    useEffect(() => {
        setOrder(
            fetchedOrder?._id === orderid
                ? {
                      status: fetchedOrder.status,
                      total: fetchedOrder.total,
                      items: fetchedOrder.items,
                      receipt: fetchedOrder.payment?.receipt_url || false,
                      cardBrand:
                          fetchedOrder.payment?.source?.brand ||
                          "Not available",
                      cardLast4: fetchedOrder.payment?.source?.last4 || "0000",
                      createdAt: fetchedOrder.createdAt
                          ? new Date(fetchedOrder.createdAt).toLocaleString()
                          : "N/A",
                  }
                : {
                      status: "Loading...",
                      total: 0,
                      items: [],
                      receipt: false,
                      cardBrand: "Loading...",
                      cardLast4: "0000",
                      createdAt: "Loading...",
                  }
        );
    }, [orderid, fetchedOrder]);

    return (
        <div className={classes.app}>
            <div className={classes.buttonWrapper}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<GoBackIcon />}
                    component={Link}
                    to="/orders"
                >
                    Go Back
                </Button>
                {order.receipt && (
                    <Button
                        style={{ marginLeft: "5px" }}
                        variant="contained"
                        color="primary"
                        endIcon={<LinkIcon />}
                        component={Link}
                        to={{ pathname: order.receipt }}
                        target="_blank"
                    >
                        View Receipt
                    </Button>
                )}
            </div>
            <Card className={classes.card}>
                <div className={classes.cardContent}>
                    {error && (
                        <Typography className={classes.error}>
                            {error}
                        </Typography>
                    )}
                    <div className={classes.cardCenterWrapper}>
                        <div className={classes.cardPfp} />
                    </div>
                    <div className={classes.cardField}>
                        <Typography variant="h6">Status:&nbsp;</Typography>
                        <Typography
                            style={{
                                color:
                                    order.status === "SUCCESS"
                                        ? "green"
                                        : order.status === "PROCESSING"
                                        ? "orange"
                                        : order.status === "FAILED"
                                        ? "red"
                                        : "inherit",
                            }}
                            variant="body1"
                        >
                            {order.status}
                        </Typography>
                    </div>
                    <div className={classes.cardField}>
                        <Typography variant="h6">Total:&nbsp;</Typography>
                        <Typography variant="body1">
                            {order.total.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </Typography>
                    </div>
                    <div className={classes.cardField}>
                        <Typography variant="h6">Card:&nbsp;</Typography>
                        <Typography variant="body1">
                            {order.cardBrand} - {order.cardLast4}
                        </Typography>
                    </div>
                    {order.items.length > 0 ? (
                        order.items.map((item) => (
                            <Card
                                key={item._id}
                                className={classes.cardItem}
                                elevation={3}
                            >
                                <div className={classes.cardItemContent}>
                                    <div className={classes.cardItemPfp} />
                                    <div>
                                        <div className={classes.cardItemField}>
                                            <Typography variant="h6">
                                                Name:&nbsp;
                                            </Typography>
                                            <Typography variant="body1">
                                                {productCache[item.productid]
                                                    ?.name || "Not available"}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardItemField}>
                                            <Typography variant="h6">
                                                Price:&nbsp;
                                            </Typography>
                                            <Typography variant="body1">
                                                {productCache[
                                                    item.productid
                                                ]?.price?.toLocaleString(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }
                                                ) || "Not available"}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardItemField}>
                                            <Typography variant="h6">
                                                Quantity:&nbsp;
                                            </Typography>
                                            <Typography variant="body1">
                                                {item.quantity ||
                                                    "Not available"}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1">
                            No items for this order
                        </Typography>
                    )}
                </div>
                <div className={classes.cardFooter}>
                    <p>Created At • {order.createdAt}</p>
                </div>
            </Card>
        </div>
    );
}

export default Order;
