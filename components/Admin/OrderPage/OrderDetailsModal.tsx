import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { format as datefnsFormat } from "date-fns";
import { OrderDetailsModalProps } from "./types";

const OrderDetailsModal = ({
  openModal,
  orderDataModal,
  handleClose,
}: OrderDetailsModalProps) => {
  return (
    <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth={"sm"}>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6" color={"text.primaryRed"}>
          Tóm tắt:
        </DialogContentText>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Mã đơn:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.referenceNumber}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Ngày tạo:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal
              ? datefnsFormat(new Date(orderDataModal?.createdAt), "Pp")
              : ""}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Cập nhật:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal
              ? datefnsFormat(new Date(orderDataModal?.updatedAt), "Pp")
              : ""}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Tên:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.contactName}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Email:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.contactEmail}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            SĐT:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.contactPhoneNumber}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Ghi chú:
            <Typography variant="body1" color="text.primary">
              {orderDataModal?.description}
            </Typography>
          </Typography>
        </Stack>

        <DialogContentText variant="h6" color={"text.primaryRed"}>
          Chi tiết và thông tin nạp nếu có:
        </DialogContentText>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Server:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.orderDetails?.accountServer}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            ID tài khoản:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.orderDetails?.accountUserId}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Tên tài khoản:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.orderDetails?.accountName}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Tên Nhân vật:
          </Typography>
          <Typography variant="body1" color="text.primary">
            {orderDataModal?.orderDetails?.accountCharacterName}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Ghi chú:
            <Typography variant="body1" color="text.primary">
              {orderDataModal?.orderDetails?.description}
            </Typography>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
