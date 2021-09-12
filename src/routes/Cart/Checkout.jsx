import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, makeStyles, Typography } from "@material-ui/core";
import { checkoutCart } from "../../store/cart/Cart.actions";
import Button from "../../components/Button/Button";

function Checkout({
    closeModal,
    jwt,
    authedCart,
    isPending,
    cartError,
    setComplete,
}) {
    const dispatch = useDispatch();
    const stripeEl = useElements();
    const stripe = useStripe();

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
        },
        error: {
            color: "red",
            marginLeft: "15px",
        },
        // Card
        card: {
            width: "350px",
        },
        cardContent: {
            margin: "10px 15px",
        },
        cardField: {
            display: "flex",
            alignItems: "center",
            "& p": {
                // For whatever reason the body isn't centered
                marginTop: "3px",
            },
            "& *:not(:last-child)": {
                marginRight: "5px",
            },
        },
        cardElementWrapper: {
            marginTop: "50px",
        },
        cardElement: {
            background: "white",
            padding: "10px 20px 11px",
            borderRadius: "5px",
            border: "1px solid #afafaf",
            boxShadow: "0px 4px 5.5px 0px rgba(0, 0, 0, 0.07)",
        },
        cardFooter: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginRight: "15px",
            marginBottom: "10px",
        },
        cardFooterTotal: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
        },
    }));
    const classes = useStyles();

    const { authedUser } = useSelector((state) => state.user);
    const [cardError, setCardError] = useState(null);

    const processPayment = async () => {
        if (!stripe || !stripeEl || !authedCart) return;
        const cardEl = stripeEl.getElement(CardElement);
        const { token } = await stripe.createToken(cardEl);
        if (token) {
            (async () => {
                await dispatch(
                    checkoutCart({
                        cartid: authedCart._id,
                        paymentInfo: token,
                        token: jwt.token,
                    })
                );
                setComplete(true);
                closeModal();
            })();
        }
    };

    return (
        <div className={classes.app}>
            <Card className={classes.card}>
                <div className={classes.cardContent}>
                    <div className={classes.cardField}>
                        <Typography variant="h6">Full Name:</Typography>
                        <Typography variant="body1">
                            {authedUser
                                ? `${authedUser.firstname} ${authedUser.lastname}`
                                : "Loading"}
                        </Typography>
                    </div>
                    <div className={classes.cardField}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography variant="body1">
                            {authedUser ? authedUser.email : "Loading"}
                        </Typography>
                    </div>
                    <div className={classes.cardElementWrapper}>
                        <CardElement
                            className={classes.cardElement}
                            options={{
                                iconStyle: "solid",
                                style: {
                                    base: {
                                        backgroundColor: "white",
                                        fontSize: "14px",
                                        fontFamily:
                                            "Roboto, Helvetica, Arial, sans-serif",
                                        fontWeight: "400",
                                        fontSmoothing: "antialiased",
                                        letterSpacing: "0.00938em",
                                    },
                                },
                                hidePostalCode: true,
                            }}
                            onChange={(evt) => {
                                setCardError(evt?.error?.message || null);
                            }}
                        />
                    </div>
                </div>
                <div className={classes.error}>
                    {cardError && (
                        <Typography variant="body2">{cardError}</Typography>
                    )}
                </div>
                <div className={classes.cardFooter}>
                    <div className={classes.cardFooterTotal}>
                        <Typography style={{ marginRight: "5px" }} variant="h5">
                            Total:
                        </Typography>
                        <Typography variant="body1">
                            {authedCart
                                ? authedCart.items
                                      .reduce(
                                          (acc, item) =>
                                              acc + item.quantity * item.price,
                                          0
                                      )
                                      .toLocaleString("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                      })
                                : "$0"}
                        </Typography>
                    </div>
                    <div>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            isLoading={isPending}
                            onClick={processPayment}
                        >
                            Pay
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Checkout;
