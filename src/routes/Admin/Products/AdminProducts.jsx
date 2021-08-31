import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Button, useMediaQuery, Tooltip } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import {
    ArrowBack as GoBackIcon,
    Visibility as ViewIcon,
    Add as CreateIcon,
} from "@material-ui/icons";
import { getProducts } from "../../../store/product/Product.actions";

function AdminProducts() {
    const dispatch = useDispatch();
    // is too small
    const isTooSmall = useMediaQuery("(max-width:440px)");

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
            marginTop: "45px",
            display: "flex",
            flexFlow: "row wrap",
            height: "70vh",
        },
        grid: {
            background: "white",
            color: "inherit",
        },
        tableCell: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
    }));
    const classes = useStyles();

    const tableColumns = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Name", width: 200 },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            renderCell: (params) => (
                <Tooltip title={params.row.description} enterTouchDelay={0}>
                    <div className={classes.tableCell}>
                        {params.row.description}
                    </div>
                </Tooltip>
            ),
        },
        { field: "price", headerName: "Price", width: 150 },
    ];

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
                <Button
                    style={{ marginBottom: "5px" }}
                    variant="contained"
                    color="secondary"
                    startIcon={<GoBackIcon />}
                    component={Link}
                    to="/admin"
                >
                    {isTooSmall ? "Back" : "Go back"}
                </Button>
                <div className={classes.buttonWrapper}>
                    <Button
                        style={{ marginRight: "10px" }}
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
                                price: `$${product.price}`,
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
