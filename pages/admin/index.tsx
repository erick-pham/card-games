import Head from "next/head";
// import { useSession, signIn, signOut } from "next-auth/react";
import { Box, Container, Grid } from "@mui/material";
import { unstable_getServerSession } from "next-auth/next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
// import { Budget } from "./components/dashboard/budget";
// import { LatestOrders } from "./components/dashboard/latest-orders";
// import { LatestProducts } from "./components/dashboard/latest-products";
// import { Sales } from "./components/dashboard/sales";
// import { TasksProgress } from "./components/dashboard/tasks-progress";
// import { TotalCustomers } from "./components/dashboard/total-customers";
// import { TotalProfit } from "./components/dashboard/total-profit";
// import { TrafficByDevice } from "./components/dashboard/traffic-by-device";
import { DashboardLayout } from "./components/dashboard-layout";

const Dashboard = () => {
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  // if (status === "unauthenticated") {
  //   return <p>Access Denied</p>;
  // }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {/* <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers />
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
              <TrafficByDevice sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid>
          </Grid>
        </Container> */}
      </Box>
    </>
  );
};

Dashboard.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(context: {
  req:
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> })
    | NextApiRequest;
  res: ServerResponse | NextApiResponse<any>;
}) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session && session.userRole === "Admin") {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/404",
    },
  };
}

export default Dashboard;
