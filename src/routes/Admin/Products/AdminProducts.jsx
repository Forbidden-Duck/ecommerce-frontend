import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Button, useMediaQuery } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import {
    ArrowBack as GoBackIcon,
    Visibility as ViewIcon,
    Add as CreateIcon,
} from "@material-ui/icons";
import { getProducts } from "../../../store/product/Product.actions";

const tableColumns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "price", headerName: "Price", width: 150 },
];

function AdminProducts() {
    const dispatch = useDispatch();
    // is too small
    const isTooSmall = useMediaQuery("(max-width:415px)");

    const useStyles = makeStyles((theme) => ({
        app: {
            display: "flex",
            justifyContent: "center",
        },
        contentWrapper: {
            marginTop: "50px",
            marginBottom: "50px",
            position: "relative",
            maxWidth: "80%",
            width: "100%",
        },
        buttonWrapper: {
            position: "absolute",
            left: "0",
        },
        gridWrapper: {
            marginTop: "60px",
            display: "flex",
            flexFlow: "row wrap",
            height: "70vh",
        },
        grid: {
            background: "white",
            color: "inherit",
        },
    }));
    const classes = useStyles();

    const { jwt } = useSelector((state) => state.auth);
    const { productCache } = useSelector((state) => state.product);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        dispatch(getProducts({ token: jwt.token }));
    }, [dispatch, jwt]);

    useEffect(() => {
        setProducts(productCache ? Object.values(productCache) : []);
    }, [productCache, setProducts]);

    const [selected, setSelected] = useState("");
    const handleNewSelected = (model) => {
        setSelected(model[0]);
    };

    return (
        <div className={classes.app}>
            <div className={classes.contentWrapper}>
                <div className={classes.buttonWrapper}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<GoBackIcon />}
                        component={Link}
                        to="/admin"
                    >
                        {isTooSmall ? "Back" : "Go back"}
                    </Button>
                    <Button
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        color="primary"
                        startIcon={<CreateIcon />}
                        component={Link}
                        to="/admin/products/create"
                    >
                        {isTooSmall ? "Create" : "Create Product"}
                    </Button>
                    {selected && (
                        <Button
                            style={{ marginLeft: "10px" }}
                            variant="contained"
                            color="primary"
                            startIcon={<ViewIcon />}
                            component={Link}
                            to={`/admin/product/${selected}`}
                        >
                            {isTooSmall ? "View" : "View Product"}
                        </Button>
                    )}
                </div>
                {products && (
                    <div className={classes.gridWrapper}>
                        <DataGrid
                            className={classes.grid}
                            components={{
                                Toolbar: !isTooSmall && GridToolbar,
                            }}
                            columns={tableColumns}
                            rows={products.map((product) => ({
                                id: product._id,
                                name: product.name,
                                description: product.description,
                                price: product.price,
                            }))}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onSelectionModelChange={handleNewSelected}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProducts;
