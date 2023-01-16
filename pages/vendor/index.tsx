import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Sales } from "components/Admin/Dashboard/Sales";
import { TotalCustomers } from "components/Admin/Dashboard/TotalCustomers";
import { TotalProfit } from "components/Admin/Dashboard/TotalProfit";
import { SalesOnProductCat } from "components/Admin/Dashboard/SalesOnProductCat";
import { DashboardLayout } from "components/AdminVendor/DashboardLayout";
import { setLoadingState, setErrorState } from "reduxjs/rootSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import message from "common/messages";

type DashboardDataType = {
  totalCustomer: number | 0;
  totalCustomerCurrentMonth: number | 0;
  totalOrderOnAccountGame: number | 0;
  totalOrderOnCardGame: number | 0;
  totalRevenue: number | 0;
  totalOrdersInProgress: number | 0;
  latestSales: Array<any>;
};
const Dashboard = () => {
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState<DashboardDataType>();
  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch(`/api/vendor/dashboard?`)
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
          console.log("data", data);
          setDashboardData(data);
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
  }, []);

  return (
    <>
      <Head>
        <title>Vendor - Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers
                totalCustomer={dashboardData?.totalCustomer}
                totalCustomerCurrentMonth={
                  dashboardData?.totalCustomerCurrentMonth
                }
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit
                sx={{ height: "100%" }}
                totalRevenue={dashboardData?.totalRevenue}
              />
            </Grid>

            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales latestSales={dashboardData?.latestSales || []} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <SalesOnProductCat
                sx={{ height: "100%" }}
                totalOrderOnAccountGame={dashboardData?.totalOrderOnAccountGame}
                totalOrderOnCardGame={dashboardData?.totalOrderOnCardGame}
              />
            </Grid>
            {/*
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.auth = {
  required: true,
  role: "Vendor",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
Dashboard.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
