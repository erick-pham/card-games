import Head from "next/head";
import {
  Box,
  Container,
  Avatar,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { CustomerListToolbar } from "./components/customer/customer-list-toolbar";
import { DashboardLayout } from "./components/dashboard-layout";
import { UserEntity } from "database/entity/entities";
import { setLoadingState, setErrorState } from "app/rootSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import message from "common/messages";
import PerfectScrollbar from "react-perfect-scrollbar";
import { format } from "date-fns";

type CustomerDataListType = {
  customers: UserEntity[],
  limit: number,
  count: number,
  currentPage: number,
  rowsPerPageOptions: number[],
  // lastPage: number,
  // nextPage: number,
  // prevPage: number,

  handleLimitChange(event: any): void,
  handlePageChange(event: any, newPage: any): void
}

export const CustomerListResults = ({
  customers,
  limit,
  count,
  currentPage,
  rowsPerPageOptions,
  handleLimitChange,
  handlePageChange
}: CustomerDataListType) => {

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers && customers.map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                // selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar src={customer?.image || ''} sx={{ mr: 2 }}>
                        AP
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.address || ''}
                  </TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>
                    {customer.createdAt ? format(new Date(customer.createdAt), "Pp") : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Card>
  );
};

const Customers = () => {
  const rowsPerPageOptions = [5, 10, 25];
  const dispatch = useDispatch();
  const [customerDataList, setCustomerDataList] = useState<any>();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
  };

  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch(`/api/users?limit=${limit}&page=${page}`)
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
          setCustomerDataList(data);
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
  }, [dispatch, limit, page]);

  return (
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
            <CustomerListResults
              customers={customerDataList?.data || []}
              count={customerDataList?.count || 0}
              limit={limit}
              currentPage={customerDataList?.currentPage - 1 || 0}
              rowsPerPageOptions={rowsPerPageOptions}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

Customers.auth = {
  required: true,
  role: "Admin",
  // loading: <div>Loading...</div>,
  // unauthorized: "/auth/signin", // redirect to this url
};

Customers.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
