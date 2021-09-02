import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, Chip } from "@material-ui/core";
import {
    LocalMall as IDIcon,
    AttachMoney as DollarIcon,
    ArrowBack as GoBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    getProductFromCache,
    getProduct,
} from "../../../store/product/Product.actions";
import Button from "../../../components/Button/Button";
import useClipboard from "react-use-clipboard";

function AdminViewProduct() {
    const dispatch = useDispatch();
    const { productid } = useParams();

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
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
            height: "500px",
            position: "relative",
        },
        cardContent: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            height: "405px",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
        },
        cardHeader: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        cardPfp: {
            backgroundImage: "url(/images/productImage.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "10%",
            margin: "10px 0px",
            width: "300px",
            height: "200px",
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
        cardFooterButtons: {
            display: "flex",
            justifyContent: "center",
        },
        "@media (max-width:350px)": {
            card: {
                width: "100vw",
            },
            buttonWrapper: {
                width: "100vw",
            },
        },
    }));
    const classes = useStyles();
    const DollarChip = withStyles({
        icon: {
            marginRight: "-15px",
        },
    })(Chip);

    const { jwt } = useSelector((state) => state.auth);
    const { fetchedProduct, error } = useSelector((state) => state.product);

    const [product, setProduct] = useState({
        name: "Loading...",
        description: "Loading...",
        price: "Loading...",
        createdAt: "Loading...",
        modifiedAt: "Loading...",
    });

    useEffect(() => {
        (async () => {
            await dispatch(getProduct({ productid, token: jwt.token }));
            dispatch(getProductFromCache(productid));
        })();
    }, [dispatch, productid, jwt]);

    useEffect(() => {
        setProduct(
            fetchedProduct?._id === productid
                ? {
                      name: fetchedProduct.name,
                      description: fetchedProduct.description,
                      price: fetchedProduct.price,
                      createdAt: new Date(
                          fetchedProduct.createdAt
                      ).toLocaleString(),
                      modifiedAt: fetchedProduct.modifiedAt
                          ? new Date(fetchedProduct.modifiedAt).toLocaleString()
                          : "N/A",
                  }
                : {
                      name: "Loading...",
                      description: "Loading...",
                      price: "Loading...",
                      createdAt: "Loading...",
                      modifiedAt: "Loading...",
                  }
        );
    }, [productid, fetchedProduct]);

    const [isCopied, setCopy] = useClipboard(productid, {
        successDuration: 2000,
    });

    const formatDescription = (description) => {
        if (description.length > 215) {
            return description.substr(0, 212) + "...";
        }
        return description;
    };

    return (
        <div className={classes.app}>
            <div className={classes.buttonWrapper}>
                <Button
                    style={{ marginRight: "5px" }}
                    variant="contained"
                    color="secondary"
                    startIcon={<GoBackIcon />}
                    component={Link}
                    to="/admin/products"
                >
                    Go back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IDIcon />}
                    onClick={setCopy}
                >
                    {isCopied ? "Copied!" : "Copy ID"}
                </Button>
            </div>
            <Card className={classes.card}>
                <div className={classes.cardContent}>
                    {error && (
                        <Typography className={classes.error}>
                            {error}
                        </Typography>
                    )}
                    <div className={classes.cardPfp} />
                    <div className={classes.cardHeader}>
                        <Typography style={{ marginRight: "5px" }} variant="h4">
                            {product.name}
                        </Typography>
                        <DollarChip
                            icon={<DollarIcon />}
                            color="primary"
                            label={
                                <Typography variant="body1">
                                    {product.price}
                                </Typography>
                            }
                        />
                    </div>
                    <Typography variant="body2">
                        {formatDescription(product.description)}
                    </Typography>
                </div>
                <div className={classes.cardFooterButtons}>
                    {product.name !== "Loading..." && (
                        <Button
                            style={{
                                marginRight: "10px",
                            }}
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            component={Link}
                            to={`/admin/product/${productid}/edit`}
                        >
                            Edit
                        </Button>
                    )}
                    {product.name !== "Loading..." && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            component={Link}
                            to={`/admin/product/${productid}/delete`}
                        >
                            Delete
                        </Button>
                    )}
                </div>
                <div className={classes.cardFooter}>
                    <p>Created At • {product.createdAt}</p>
                    <p>Last Saved At • {product.modifiedAt}</p>
                </div>
            </Card>
        </div>
    );
}

export default AdminViewProduct;
