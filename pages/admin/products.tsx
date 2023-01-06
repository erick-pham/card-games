import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { ProductListToolbar } from "./components/product/product-list-toolbar";
import { ProductCard } from "./components/product/product-card";
import { DashboardLayout } from "./components/dashboard-layout";
import { ProductModal } from "./components/product/product-modal";
import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import Product from "database/entity/product";
const Products = () => {
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [productEdit, setProductEdit] = useState<Product | undefined | null>();
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
  }, [dispatch, reloadPage]);

  const handleReloadPage = () => {
    setReloadPage(!reloadPage);
  };

  // Modal Add/Edit Product
  const handleClickAddProduct = () => {
    setProductEdit(null);
    setOpenModal(true);
  };

  const handleClickEditProduct = (selectedProductId: string) => {
    const editItem = products.find((i) => i.id === selectedProductId);
    setProductEdit(editItem);
    setOpenModal(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Head>
        <title>Admin - Products</title>
        <meta
          name="description"
          content="Admin - Product Management by Erick.Pham"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProductModal
        openModal={openModal}
        handleReloadPage={handleReloadPage}
        handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
        productEdit={productEdit}
      ></ProductModal>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar
            title={"Products"}
            handleClickAddProduct={handleClickAddProduct}
          />
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {products &&
                products.length > 0 &&
                products.map((product) => (
                  <Grid item key={product.id} lg={4} md={6} xs={12}>
                    <ProductCard
                      handleClickEditProduct={handleClickEditProduct}
                      product={product}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <Pagination color="primary" count={3} size="small" />
          </Box> */}
        </Container>
      </Box>
    </>
  );
};

Products.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
Products.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
