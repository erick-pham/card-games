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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LaunchIcon from "@mui/icons-material/Launch";
import { DashboardLayout } from "pages/admin/components/dashboard-layout";
import { setErrorState, setLoadingState } from "reduxjs/rootSlice";
import NextLinkComposed from "components/NextLinkComposed";
import message from "@common/messages";

import numeral from "numeral";
import { format as datefnsFormat } from "date-fns";
import ListToolbarSearch from "components/Admin/ListToolbarSearch";
import {
  OrderListAPIReponse,
  OrderListResultsProps,
  Order,
} from "components/Admin//OrderPage/types";
import OrderDetailsModal from "components/Admin/OrderPage/OrderDetailsModal";
import OrderDetailsModalChangeStatus from "components/Admin/OrderPage/OrderDetailsModalChangeStatus";
import { StyledTableCell } from "components/Admin/CustomTable";
import {
  GetLabelText,
  ORDER_STATUS_LABEL,
  PRODUCT_ITEM_TYPES_LABEL,
  StatusColor,
} from "common/constants";

const OrderPage = () => {
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderDataModal, setOrderDataModal] = useState<Order>();
  const [queryString, setQueryString] = useState({
    limit: 5,
    page: 1,
    keyword: "",
    orderStatus: "",
  });

  const [orders, setOrders] = useState<OrderListAPIReponse>();

  useEffect(() => {
    const qs =
      "?" +
      new URLSearchParams({
        limit: queryString.limit + "",
        page: queryString.page + "",
        keyword: queryString.keyword,
        status: queryString.orderStatus + "",
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
  }, [dispatch, queryString, reload]);

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

  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [orderDataModalChangeStatus, setOrderDataModalChangeStatus] = useState({
    itemId: "",
    itemStatus: "",
  });

  const handleCloseModalChangeStatus = () => {
    setOpenModalChangeStatus(false);
  };

  const handleClickCellStatus = (orderId: string, status: string) => {
    setOrderDataModalChangeStatus({
      itemId: orderId,
      itemStatus: status,
    });
    setOpenModalChangeStatus(true);
  };

  const handleConfirmModalChangeStatus = (
    orderId: string,
    newStatus: string
  ) => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: orderId,
        status: newStatus,
      }),
    })
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
          setReload(!reload);
          handleCloseModalChangeStatus();
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
  };

  const handleChangeOrderStatus = (e: any) => {
    setQueryString({
      ...queryString,
      orderStatus: e.target.value || "",
    });
  };
  return (
    <>
      <Head>
        <title>Admin - Orders</title>
      </Head>
      <OrderDetailsModal
        openModal={openModal}
        orderDataModal={orderDataModal}
        handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
      ></OrderDetailsModal>
      {openModalChangeStatus && (
        <OrderDetailsModalChangeStatus
          open={openModalChangeStatus}
          onClose={handleCloseModalChangeStatus}
          itemStatus={orderDataModalChangeStatus.itemStatus}
          itemId={orderDataModalChangeStatus.itemId}
          handleConfirmModalChangeStatus={handleConfirmModalChangeStatus}
        ></OrderDetailsModalChangeStatus>
      )}
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
            headTitle={"Orders"}
            placeholderSearch={"Search Order Ref. Number"}
            primaryComponent={
              <Grid container spacing={2}>
                {/* <Grid item xs={12} md={3}>
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
                </Grid> */}
                <Grid item xs={12} md={3}>
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    variant="standard"
                    size="medium"
                  >
                    <InputLabel>Filter by status</InputLabel>
                    <Select
                      value={queryString.orderStatus}
                      onChange={handleChangeOrderStatus}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {ORDER_STATUS_LABEL.map((option) => (
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
            <OrderListResults
              orders={orders}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleClickAction={handleClickAction}
              handleClickCellStatus={handleClickCellStatus}
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
  handleClickCellStatus,
}: OrderListResultsProps) => {
  return (
    <Card>
      {/* <PerfectScrollbar> */}
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width={"10%"}>#</StyledTableCell>
                <StyledTableCell>Order Ref</StyledTableCell>
                <StyledTableCell>Product type</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Contact Name</StyledTableCell>
                <StyledTableCell>Contact Phone</StyledTableCell>
                {/* <StyledTableCell>Contact Email</StyledTableCell> */}
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
                <TableRow hover key={order.id}>
                  <StyledTableCell>
                    <Tooltip title="View more details">
                      <InfoIcon
                        onClick={() => handleClickAction(order.id)}
                      ></InfoIcon>
                    </Tooltip>

                    <Tooltip title="View product">
                      <NextLinkComposed
                        target={"_blank"}
                        href={`/product-account-game/${order.productItemId}/details`}
                      >
                        <LaunchIcon></LaunchIcon>
                      </NextLinkComposed>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>{order?.referenceNumber}</StyledTableCell>
                  <StyledTableCell>
                    {GetLabelText(
                      PRODUCT_ITEM_TYPES_LABEL,
                      order.productItem?.type
                    )}
                  </StyledTableCell>
                  <StyledTableCell
                    onClick={() =>
                      handleClickCellStatus(order.id, order.status)
                    }
                  >
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
                  {/* <StyledTableCell>{order?.contactEmail}</StyledTableCell> */}

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

OrderPage.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
OrderPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default OrderPage;
