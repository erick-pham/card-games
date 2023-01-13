import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "components/Admin/Dashboard/Budget";
// import { LatestOrders } from "./components/dashboard/latest-orders";
// import { LatestProducts } from "./components/dashboard/latest-products";
import { Sales } from "components/Admin/Dashboard/Sales";
import { TasksProgress } from "components/Admin/Dashboard/TasksProgress";
import { TotalCustomers } from "components/Admin/Dashboard/TotalCustomers";
import { TotalProfit } from "components/Admin/Dashboard/TotalProfit";
import { SalesOnProductCat } from "components/Admin/Dashboard/SalesOnProductCat";
import { DashboardLayout } from "./components/dashboard-layout";

const Dashboard = () => {
  const data = {
    totalCustomer: 10,
    totalCustomerGrowthRate: 0.91,
    totalOrderOnAccountGame: 10,
    totalOrderOnCardGame: 9,
  };

  return (
    <>
      <Head>
        <title>Admin - Dashboard</title>
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
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers
                totalCustomer={data.totalCustomer}
                totalCustomerGrowthRate={data.totalCustomerGrowthRate}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: "100%" }} />
            </Grid>

            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <SalesOnProductCat
                sx={{ height: "100%" }}
                totalOrderOnAccountGame={data.totalOrderOnAccountGame}
                totalOrderOnCardGame={data.totalOrderOnCardGame}
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
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};
Dashboard.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
