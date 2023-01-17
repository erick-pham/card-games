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
import { DashboardLayout } from "components/AdminVendor/DashboardLayout";
import { ProductDetailsModal } from "components/AdminVendor/ProductDetailsModal";
import { setErrorState, setLoadingState } from "reduxjs/rootSlice";
import message from "common/messages";
import { format as datefnsFormat } from "date-fns";
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
    productItemStatus: "",
  });

  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productItemData, setProductItemData] =
    useState<ProductItemListAPIReponse>();

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
    fetch("/api/vendor/product")
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
          status: String(queryString.productItemStatus),
        }).toString();

      fetch("/api/vendor/product-items" + qs)
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

  const handleChangeProductStatus = (e: any) => {
    setQueryString({
      ...queryString,
      productItemStatus: e.target.value || "",
    });
  };
  return (
    <>
      <Head>
        <title>Vendor - Products Items</title>
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
                    <InputLabel>Filter item by status</InputLabel>
                    <Select
                      value={queryString.productItemStatus}
                      onChange={handleChangeProductStatus}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {PRODUCT_ITEM_STATUS_LABEL.map((option) => (
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
                <StyledTableCell width={"10%"}>Type</StyledTableCell>
                <StyledTableCell width={"15%"}>Name</StyledTableCell>
                <StyledTableCell width={"10%"}>Price</StyledTableCell>
                <StyledTableCell width={"10%"}>Sale Price</StyledTableCell>
                <StyledTableCell width={"10%"}>Sale End Date</StyledTableCell>
                <StyledTableCell width={"10%"}>Status</StyledTableCell>
                <StyledTableCell width={"20%"}>Description</StyledTableCell>
                {/* <StyledTableCell width={"25%"} align="right">
                  Thumbnail
                </StyledTableCell> */}
                <StyledTableCell width={"15%"}>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productItemData &&
                productItemData?.data?.map((productItem) => (
                  <StyledTableRow key={productItem.id}>
                    <StyledTableCell>
                      {GetLabelText(PRODUCT_ITEM_TYPES_LABEL, productItem.type)}
                    </StyledTableCell>
                    <StyledTableCell>{productItem.name}</StyledTableCell>
                    <StyledTableCell>
                      {numeral(productItem.price).format("0,0") +
                        " " +
                        productItem.currency}
                    </StyledTableCell>
                    <StyledTableCell>
                      {numeral(productItem.salePrice).format("0,0") +
                        " " +
                        productItem.currency}
                    </StyledTableCell>
                    <StyledTableCell>
                      {productItem?.salePriceEndDate
                        ? datefnsFormat(
                            new Date(productItem.salePriceEndDate),
                            "dd-MM-yyyy"
                          )
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={GetLabelText(
                          PRODUCT_ITEM_STATUS_LABEL,
                          productItem.status
                        )}
                        color={StatusColor(productItem.status)}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{productItem.description}</StyledTableCell>
                    {/* <StyledTableCell align="right">
                      <CardMedia
                        component="img"
                        height="150"
                        image={productItem.thumbnail}
                        alt="alt"
                      />
                    </StyledTableCell> */}
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: 4 }}
                        onClick={() =>
                          window.open(
                            `/product-account-game/${productItem.id}/details`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        Preview
                      </Button>
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
  role: "Vendor",
};
ProductItemsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ProductItemsPage;
