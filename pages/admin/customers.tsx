import Head from "next/head";
import { Box, Container } from "@mui/material";
import { unstable_getServerSession } from "next-auth/next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { CustomerListResults } from "./components/customer/customer-list-results";
import { CustomerListToolbar } from "./components/customer/customer-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { customers } from "../../__mocks__/customers";

const Customers = () => (
  <>
    <Head>
      <title>Customers</title>
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
Customers.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

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
      destination: "/auth/signin",
    },
  };
}

export default Customers;
