import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "./components/customer/customer-list-results";
import { CustomerListToolbar } from "./components/customer/customer-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { customers } from "../../__mocks__/customers";

const Customers = () => (
  <>
    <Head>
      <title>Admin - Customers</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

Customers.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};

Customers.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
