import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  DialogActions,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ORDER_STATUS_LABEL } from "@common/constants";
import { useState } from "react";

export interface SimpleDialogProps {
  open: boolean;
  itemId: string;
  itemStatus: string;
  handleConfirmModalChangeStatus: (orderId: string, newStatus: string) => void;
  onClose: () => void;
}

const OrderDetailsModalChangeStatus = (props: SimpleDialogProps) => {
  const { onClose, open, handleConfirmModalChangeStatus, itemId, itemStatus } =
    props;
  console.log("props", props);
  const handleClose = () => {
    onClose();
  };

  const [status, setStatus] = useState(itemStatus);
  console.log("status", status);
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Cập nhật trạng thái</DialogTitle>
      <FormControl sx={{ m: 1 }} variant="standard">
        <Select value={status} onChange={handleChangeStatus}>
          {ORDER_STATUS_LABEL.map((status, index) => (
            <MenuItem key={index} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DialogActions>
        <Button onClick={() => handleConfirmModalChangeStatus(itemId, status)}>
          Confirm
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModalChangeStatus;
