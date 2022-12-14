import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "./components/account/account-profile";
import { AccountProfileDetails } from "./components/account/account-profile-details";
import { DashboardLayout } from "./components/dashboard-layout";

const Account = () => {
  return (
    <>
      <Head>
        <title>Admin - Account</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Account
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <AccountProfile />
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <AccountProfileDetails />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Account.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};

Account.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
