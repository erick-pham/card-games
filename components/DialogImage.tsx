import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import { setDialogImageState, selectDialogImageState } from "reduxjs/rootSlice";

export default function ResponsiveDialog() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const dialogImg = useSelector(selectDialogImageState);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    dispatch(setDialogImageState({ open: false, url: "" }));
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogImg.open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1, marginTop: 1 }}>
          <CardMedia component="img" image={dialogImg.url || ""} alt="alt" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
