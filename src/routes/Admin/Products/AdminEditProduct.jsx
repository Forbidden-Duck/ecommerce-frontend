import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, Typography, Card } from "@material-ui/core";
import { AttachMoney as DollarIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    getProductFromCache,
    getProduct,
    updateProduct,
} from "../../../store/product/Product.actions";
import Button from "../../../components/Button/Button";
import TextField from "../../../components/TextField/TextField";

function AdminEditProduct() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { productid } = useParams();

    const useStyles = makeStyles((theme) => ({
        // Global
        app: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "92vh",
            width: "100vw",
        },
        // Form Content
        form: {
            display: "grid",
            rowGap: "30px",
            margin: "30px",
        },
        formCard: {
            width: "600px",
            position: "relative",
        },
    }));
    const classes = useStyles();

    const { jwt } = useSelector((state) => state.auth);
    const { fetchedProduct, isPending, error } = useSelector(
        (state) => state.product
    );

    const [product, setProduct] = useState({
        name: "Loading...",
        description: "Loading...",
        price: "Loading...",
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
                  }
                : {
                      name: "Loading...",
                      description: "Loading...",
                      price: "Loading...",
                  }
        );
    }, [productid, fetchedProduct]);

    const editSchema = Yup.object()
        .shape({
            name: Yup.string().min(
                2,
                "Product name must be longer than 2 characters"
            ),
            description: Yup.string().min(
                20,
                "Product description must be longer than 20 characters"
            ),
            price: Yup.string().matches(
                /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/,
                "Product price must be a number"
            ),
        })
        .test("oneExists", null, (product) => {
            if (product.name || product.description || product.price) {
                return true;
            }
            return new Yup.ValidationError(
                "Must edit at least 1 field",
                null,
                "oneExists"
            );
        });

    const handleSave = async (product) => {
        for (const [key, value] of Object.entries(product)) {
            // Delete the empty strings
            if (!value) {
                delete product[key];
            }
        }
        await dispatch(updateProduct({ productid, product, token: jwt.token }));
    };

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push(`/admin/product/${productid}`);
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit, productid]);

    const onSubmit = async (values) => {
        const { name, description, price } = values;
        await handleSave({ name, description, price: parseInt(price) });
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    price: "",
                }}
                validationSchema={editSchema}
                validateOnBlur
                onSubmit={onSubmit}
            >
                {(formProps) => (
                    <Card className={classes.formCard}>
                        <Form className={classes.form}>
                            <Typography variant="h4">Edit Product</Typography>
                            <TextField
                                label="Name"
                                name="name"
                                id="name-input"
                                autoComplete="off"
                                placeholder={product.name}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                id="description-input"
                                autoComplete="off"
                                placeholder={product.description}
                            />
                            <TextField
                                label="Price"
                                name="price"
                                id="price-input"
                                autoComplete="off"
                                placeholder={product.price.toString()}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DollarIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {formProps.errors.oneExists && (
                                <div
                                    style={{
                                        marginTop: "-20px",
                                    }}
                                >
                                    {formProps.errors.oneExists}
                                </div>
                            )}
                            {error && <div>{error}</div>}
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                isLoading={isPending}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                style={{
                                    marginTop: "-20px",
                                }}
                                component={Link}
                                to={`/admin/product/${productid}`}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </Card>
                )}
            </Formik>
        </div>
    );
}

export default AdminEditProduct;
