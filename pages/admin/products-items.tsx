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
  Select,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  Card,
  TablePagination,
} from "@mui/material";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import ListToolbarSearch from "components/Admin/ListToolbarSearch";
import { DashboardLayout } from "./components/dashboard-layout";
import { ProductDetailsModal } from "./components/product-details/product-details-modal";
import { setErrorState, setLoadingState } from "../../reduxjs/rootSlice";
import message from "common/messages";

import {
  PRODUCT_ITEM_STATUS_LABEL,
  GetLabelText,
  PRODUCT_ITEM_TYPES_LABEL,
  StatusColor,
} from "common/constants";
import { StyledTableCell, StyledTableRow } from "components/Admin/CustomTable";
import {
  ProductItemListAPIReponse,
  ProductItem,
  Product,
} from "components/Admin/OrderPage/types";

const ProductItemsPage = () => {
  const dispatch = useDispatch();
  const [queryString, setQueryString] = useState({
    limit: 5,
    page: 1,
    keyword: "",
    productItemType: "",
  });

  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productItemData, setProductItemData] =
    useState<ProductItemListAPIReponse>();

  const [selectedProduct, setSelectedProduct] = useState<
    Product | undefined | null
  >();
  const [reloadPage, setReloadPage] = useState(false);

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
          setSelectedProductId(data[0]?.id || "");
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
  }, [dispatch]);

  useEffect(() => {
    if (selectedProductId) {
      dispatch(
        setLoadingState({
          loading: true,
          loadingMessage: message.appAPILoading,
        })
      );
      const qs =
        "?" +
        new URLSearchParams({
          productId: selectedProductId,
          limit: queryString.limit + "",
          page: queryString.page + "",
          keyword: queryString.keyword,
          type: String(queryString.productItemType),
        }).toString();

      fetch("/api/product-items" + qs)
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
            setProductItemData(data);
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
    }
  }, [dispatch, selectedProductId, reloadPage, queryString]);

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

  const handleClickEdit = (selectedProductItemId: string) => {
    const editItem = productItemData?.data?.find(
      (i) => i.id === selectedProductItemId
    );
    setProductEdit(editItem);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLimitChange = (event: any) => {
    setQueryString({
      ...queryString,
      limit: event.target.value,
      page: 1,
    });
  };

  const handlePageChange = (event: any, newPage: any) => {
    let page = productItemData?.currentPage || 1;
    if (newPage === page) {
      page += 1;
    } else if (newPage < page) {
      page = productItemData?.prevPage || 1;
    }

    setQueryString({
      ...queryString,
      page,
    });
  };

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      setQueryString({
        ...queryString,
        keyword: e.target.value || "",
      });
    }
  };

  const handleChangeProductType = (e: any) => {
    setQueryString({
      ...queryString,
      productItemType: e.target.value || "",
    });
  };
  return (
    <>
      <Head>
        <title>Admin - Products Items</title>
      </Head>
      <ProductDetailsModal
        openModal={openModal}
        handleReloadPage={handleReloadPage}
        handleClose={handleCloseModal}
        productEdit={productEdit}
        selectedProductId={selectedProductId}
      ></ProductDetailsModal>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        <Container maxWidth={false}>
          <ListToolbarSearch
            handleSearch={handleSearch}
            headTitle={"Products Items"}
            placeholderSearch={"Search name"}
            rightComponent={
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickAddProduct}
              >
                Add Item
              </Button>
            }
            primaryComponent={
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    variant="standard"
                    size="medium"
                  >
                    <InputLabel>Select Product</InputLabel>
                    <Select
                      value={selectedProductId}
                      onChange={handleChangeActiveProduct}
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
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    variant="standard"
                    size="medium"
                  >
                    <InputLabel>Select product type</InputLabel>
                    <Select
                      value={queryString.productItemType}
                      onChange={handleChangeProductType}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {PRODUCT_ITEM_TYPES_LABEL.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            }
          />
          <Box sx={{ mt: 3 }}>
            <ProductItemTable
              productItemData={productItemData}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleClickEdit={handleClickEdit}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

type ProductItemTableProps = {
  productItemData?: ProductItemListAPIReponse;
  handleLimitChange: (event: any) => void;
  handlePageChange: (event: any, newPage: any) => void;
  handleClickEdit: (productItemId: string) => void;
};
const ProductItemTable = ({
  productItemData,
  handleLimitChange,
  handlePageChange,
  handleClickEdit,
}: ProductItemTableProps) => {
  return (
    <Card>
      <Box>
        <TableContainer component={Paper}>
          <Table>
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
              {productItemData &&
                productItemData?.data.map((productItem) => (
                  <StyledTableRow key={productItem.id}>
                    <StyledTableCell component="th" scope="row">
                      {productItem.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {GetLabelText(PRODUCT_ITEM_TYPES_LABEL, productItem.type)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {numeral(productItem.price).format("0,0") +
                        " " +
                        productItem.currency}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Chip
                        label={GetLabelText(
                          PRODUCT_ITEM_STATUS_LABEL,
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
                        onClick={() => handleClickEdit(productItem.id)}
                      >
                        Edit
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        component="div"
        count={productItemData?.count || 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={(productItemData?.currentPage || 1) - 1}
        rowsPerPage={productItemData?.limit || 0}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ProductItemsPage.auth = {
  required: true,
  role: "Admin",
};
ProductItemsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ProductItemsPage;
