import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { deleteProduct } from "../../../store/product/Product.actions";
import Button from "../../../components/Button/Button";

function AdminDeleteProduct() {
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
    const { isPending, error } = useSelector((state) => state.product);

    const handleDelete = async () =>
        await dispatch(deleteProduct({ productid, token: jwt.token }));

    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        if (submit && !error) {
            history.push("/admin/products");
        } else if (submit && error) {
            setSubmit(false);
        }
    }, [history, error, submit, setSubmit]);

    const onSubmit = async () => {
        await handleDelete();
        setSubmit(true);
    };

    return (
        <div className={classes.app}>
            <Card className={classes.formCard}>
                <div className={classes.form}>
                    <Typography variant="h4">Delete Product</Typography>
                    {error && <div>{error}</div>}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        isLoading={isPending}
                    >
                        Delete
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
                </div>
            </Card>
        </div>
    );
}

export default AdminDeleteProduct;
