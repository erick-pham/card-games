import Head from "next/head";
import { Box, Container } from "@mui/material";
import { unstable_getServerSession } from "next-auth/next";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { CustomerListResults } from "./components/orders/orders-list-results";
import { CustomerListToolbar } from "./components/orders/orders-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { customers } from "../../__mocks__/customers";
import { v4 as uuid } from "uuid";
const orders = [
  {
    id: uuid(),
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    product: {
      name: "Test1",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    product: {
      name: "Test2",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    product: {
      name: "Test3",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    product: {
      name: "Test4",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    product: {
      name: "Test5",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    product: {
      name: "Test6",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

const Orders = () => (
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
        <CustomerListToolbar />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults orders={orders} />
        </Box>
      </Container>
    </Box>
  </>
);
Orders.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

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

export default Orders;
