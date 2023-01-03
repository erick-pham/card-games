import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DashboardLayout } from "pages/admin/components/dashboard-layout";
import { setErrorState, setLoadingState } from "app/rootSlice";

import { StatusColor } from "@common/constants";
import message from "@common/messages";

import numeral from "numeral";
import { format as datefnsFormat } from "date-fns";
import ListToolbarSearch from "../../components/Admin/ListToolbarSearch";
import {
  OrderAPIReponse,
  OrderListResultsProps,
  Order,
} from "components/Admin//OrderPage/types";
import { OrderDetailsModal } from "../../components/Admin/OrderPage/OrderDetailsModal";
import { StyledTableCell } from "../../components/Admin/CustomTable";

const Orders = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [orderDataModal, setOrderDataModal] = useState<Order>();
  const [queryString, setQueryString] = useState({
    limit: 5,
    page: 1,
    keyword: "",
  });

  const [orders, setOrders] = useState<OrderAPIReponse>();

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickAction = (orderId: string) => {
    const item = orders?.data.find((i) => i.id === orderId);
    setOrderDataModal(item);
    setOpenModal(true);
  };

  return (
    <>
      <Head>
        <title>Admin - Orders</title>
      </Head>
      <OrderDetailsModal
        openModal={openModal}
        orderDataModal={orderDataModal}
        // handleReloadPage={handleReloadPage}
        handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
        // productEdit={productEdit}
      ></OrderDetailsModal>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ListToolbarSearch
            handleSearch={handleSearch}
            headTitle={"Orders"}
            placeholderSearch={"Search Order Ref. Number"}
          />
          <Box sx={{ mt: 3 }}>
            <OrderListResults
              orders={orders}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleClickAction={handleClickAction}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

const OrderListResults = ({
  orders,
  handleLimitChange,
  handlePageChange,
  handleClickAction,
}: OrderListResultsProps) => {
  return (
    <Card>
      {/* <PerfectScrollbar> */}
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                onClick={() => {
                  console.log("Detected Row Click");
                }}
              >
                <StyledTableCell
                  onClick={() => {
                    console.log("Detected Row Click");
                  }}
                >
                  Order Ref
                </StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Contact Name</StyledTableCell>
                <StyledTableCell>Contact Phone</StyledTableCell>
                <StyledTableCell>Contact Email</StyledTableCell>
                <StyledTableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel direction="desc">
                      Date Create
                    </TableSortLabel>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel direction="desc">
                      Last Update
                    </TableSortLabel>
                  </Tooltip>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow
                  hover
                  key={order.id}
                  onClick={() => handleClickAction(order.id)}
                >
                  <StyledTableCell>{order.referenceNumber}</StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={order?.status}
                      color={StatusColor(order?.status)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {numeral(order.amount).format("0,0")}
                  </StyledTableCell>
                  <StyledTableCell>{order?.contactName}</StyledTableCell>
                  <StyledTableCell>{order?.contactPhoneNumber}</StyledTableCell>
                  <StyledTableCell>{order?.contactEmail}</StyledTableCell>

                  <StyledTableCell>
                    {datefnsFormat(new Date(order.createdAt), "Pp")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {datefnsFormat(new Date(order.updatedAt), "Pp")}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* </PerfectScrollbar> */}
      <TablePagination
        component="div"
        count={orders?.count || 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={(orders?.currentPage || 1) - 1}
        rowsPerPage={orders?.limit || 0}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
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
