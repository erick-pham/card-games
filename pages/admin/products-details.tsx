import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Button,
  Box,
  CardMedia,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  // Pagination,
  Select,
  // TextField,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";

import { tableCellClasses } from "@mui/material/TableCell";
import numeral from "numeral";
import { ProductListToolbar } from "./components/product/product-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { ProductDetailsModal } from "./components/product-details/product-details-modal";
import { setErrorState, setLoadingState } from "../../app/rootSlice";
import message from "../../common/messages";
import { Product } from "../../interfaces/entity/product";
import { ProductItem } from "../../interfaces/entity/product_item";
import {
  ProductItemStatus,
  GetLabelText,
  ProductItemTypes,
  StatusColor,
} from "../../common/constants";

const ProductItems = () => {
  const dispatch = useDispatch();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<
    Product | undefined | null
  >();
  const [reloadPage, setReloadPage] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [productEdit, setProductEdit] = useState<
    ProductItem | undefined | null
  >();

  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/product")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === true) {
          dispatch(
            setErrorState({
              message: data.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          if (!selectedProductId) {
            setSelectedProductId(data[0]?.id || "");
          }
          setSelectedProduct(data && data[0] ? data[0] : null);
          setProducts(data);
        }
      })
      .finally(() => {
        dispatch(
          setLoadingState({
            loading: false,
            loadingMessage: null,
          })
        );
      });
  }, [dispatch, reloadPage, selectedProductId]);

  const handleReloadPage = () => {
    setReloadPage(!reloadPage);
  };

  const handleChangeActiveProduct = (event: { target: { value: string } }) => {
    const p = products.find((p) => p.id === event.target.value);
    setSelectedProductId(p?.id || "");
    setSelectedProduct(p);
  };

  // Modal Add/Edit Product
  const handleClickAddProduct = () => {
    setProductEdit(null);
    setOpenModal(true);
  };

  const handleOpenModal = (selectedProductItemId: string) => {
    const editItem = selectedProduct?.productItems?.find(
      (i) => i.id === selectedProductItemId
    );
    setProductEdit(editItem);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Head>
        <title>Admin - Product Details</title>
        <meta
          name="description"
          content="Admin - Product Management by Erick.Pham"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProductDetailsModal
        openModal={openModal}
        handleReloadPage={handleReloadPage}
        handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
        productEdit={productEdit}
        selectedProductId={selectedProductId}
      ></ProductDetailsModal>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar
            title={"Product Details"}
            handleClickAddProduct={handleClickAddProduct}
          />
          <FormControl
            sx={{ m: 1, minWidth: 500 }}
            variant="standard"
            size="medium"
          >
            <InputLabel id="demo-customized-select-label">
              Select Product
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={selectedProductId}
              onChange={handleChangeActiveProduct}
              // input={<BootstrapInput />}
            >
              {products &&
                products.length > 0 &&
                products.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell width={"10%"}>Name</StyledTableCell>
                      <StyledTableCell width={"10%"} align="right">
                        Type
                      </StyledTableCell>
                      <StyledTableCell width={"10%"} align="right">
                        Price
                      </StyledTableCell>
                      <StyledTableCell width={"5%"} align="right">
                        Status
                      </StyledTableCell>
                      <StyledTableCell width={"30%"} align="right">
                        Description
                      </StyledTableCell>
                      <StyledTableCell width={"30%"} align="right">
                        Thumbnail
                      </StyledTableCell>
                      <StyledTableCell width={"5%"} align="right">
                        Action
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProduct &&
                      selectedProduct.productItems &&
                      selectedProduct.productItems.map((productItem) => (
                        <StyledTableRow key={productItem.id}>
                          <StyledTableCell component="th" scope="row">
                            {productItem.name}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {GetLabelText(ProductItemTypes, productItem.type)}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {numeral(productItem.price).format("0,0") +
                              " " +
                              productItem.currency}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Chip
                              label={GetLabelText(
                                ProductItemStatus,
                                productItem.status
                              )}
                              color={StatusColor(productItem.status)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {productItem.description}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <CardMedia
                              component="img"
                              height="150"
                              image={productItem.thumbnail}
                              alt="alt"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{ margin: 4 }}
                              onClick={() => handleOpenModal(productItem.id)}
                            >
                              Edit
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

ProductItems.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
ProductItems.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ProductItems;
