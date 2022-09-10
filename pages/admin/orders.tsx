import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Container } from "@mui/material";
import { OrderListResults } from "./components/orders/orders-list-results";
import { OrderListToolbar } from "./components/orders/orders-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { setErrorState, setLoadingState } from "../../app/rootSlice";
import message from "../../common/messages";
import { OrderEntity } from "../../interfaces/entity/order";

export type OrderAPIReponse = {
  data: OrderEntity[];
  count: number;
  limit: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
};

const Orders = () => {
  const dispatch = useDispatch();
  const [queryString, setQueryString] = useState({
    limit: 5,
    page: 1,
    keyword: "",
  });

  const [orders, setOrders] = useState<OrderAPIReponse | undefined>();
  useEffect(() => {
    const qs =
      "?" +
      new URLSearchParams({
        limit: queryString.limit + "",
        page: queryString.page + "",
        keyword: queryString.keyword,
      }).toString();
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/orders" + qs)
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
          setOrders(data);
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
  }, [dispatch, queryString]);

  const handleLimitChange = (event: any) => {
    setQueryString({
      ...queryString,
      limit: event.target.value,
      page: 1,
    });
  };

  const handlePageChange = (event: any, newPage: any) => {
    let page = orders?.currentPage || 1;
    if (newPage === page) {
      page += 1;
    } else if (newPage < page) {
      page = orders?.prevPage || 1;
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

  return (
    <>
      <Head>
        <title>Admin - Orders</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <OrderListToolbar handleSearch={handleSearch} />
          <Box sx={{ mt: 3 }}>
            <OrderListResults
              orders={orders}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Orders.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
Orders.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Orders;
