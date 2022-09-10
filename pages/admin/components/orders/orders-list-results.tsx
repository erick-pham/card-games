import PerfectScrollbar from "react-perfect-scrollbar";
import { format } from "date-fns";
import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import numeral from "numeral";

import { StatusColor } from "../../../../common/constants";
import { OrderAPIReponse } from "../../orders";

export const OrderListResults = ({
  orders,
  handleLimitChange,
  handlePageChange,
}: {
  orders: OrderAPIReponse | undefined;
  handleLimitChange: any;
  handlePageChange: any;
}) => {
  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Ref</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Last Update
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow hover key={order.id}>
                  <TableCell>{order.referenceNumber}</TableCell>
                  <TableCell>{order.productItem.name}</TableCell>
                  <TableCell>{numeral(order.amount).format("0,0")}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "dd-MMM-yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.updatedAt), "dd-MMM-yyyy")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order?.status}
                      color={StatusColor(order?.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
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

export default OrderListResults;
