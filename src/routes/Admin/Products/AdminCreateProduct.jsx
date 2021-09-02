import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, Typography, Card } from "@material-ui/core";
import { AttachMoney as DollarIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { createProduct } from "../../../store/product/Product.actions";
import Button from "../../../components/Button/Button";
import TextField from "../../../components/TextField/TextField";

function AdminCreateProduct() {
    const dispatch = useDispatch();
    const history = useHistory();

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
    const { isPending, error } = useSelector((state) => state.product);

    const createSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Product name must be longer than 2 characters")
            .required("Product name is required"),
        description: Yup.string()
            .min(20, "Product description must be longer than 20 characters")
            .required("Product description is required"),
        price: Yup.string()
            .required("Product price is required")
            .matches(
                /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/,
                "Product price must be a number"
            ),
    });

    const handleSave = async (product) => {
        for (const [key, value] of Object.entries(product)) {
            // Delete the empty strings
            if (!value) {
                delete product[key];
            }
        }
        await dispatch(createProduct({ product, token: jwt.token }));
    };

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push("/admin/products");
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit]);

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
                validationSchema={createSchema}
                validateOnBlur
                onSubmit={onSubmit}
            >
                <Card className={classes.formCard}>
                    <Form className={classes.form}>
                        <Typography variant="h4">Create Product</Typography>
                        <TextField
                            label="Name"
                            name="name"
                            id="name-input"
                            autoComplete="off"
                            placeholder=""
                        />
                        <TextField
                            label="Description"
                            name="description"
                            id="description-input"
                            autoComplete="off"
                            placeholder=""
                        />
                        <TextField
                            label="Price"
                            name="price"
                            id="price-input"
                            autoComplete="off"
                            placeholder=""
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DollarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && <div>{error}</div>}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            isLoading={isPending}
                        >
                            Create
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="button"
                            style={{
                                marginTop: "-20px",
                            }}
                            component={Link}
                            to={`/admin/products`}
                        >
                            Cancel
                        </Button>
                    </Form>
                </Card>
            </Formik>
        </div>
    );
}

export default AdminCreateProduct;
