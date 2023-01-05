import React from "react";
import { Dialog, CircularProgress, Typography } from "@mui/material";

function LoadingDialog(props: { isLoading: boolean; message: string | null }) {
  return (
    <Dialog
      open={props.isLoading}
      // classes={{
      //   paper: "paper",
      // }}
      sx={{
        ".MuiDialog-paper": {
          display: "flex",
          alignItems: "center",
          overflow: "visible",
          backgroundColor: "transparent",
          textAlign: "center",
          boxShadow: "none",
          color: "#ffffff",
        },
      }}
    >
      <CircularProgress color="primary" />
      {props.message ? (
        <Typography
          variant="body1"
          align="center"
          display="block"
          color="inherit"
          style={{
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          {props.message}
        </Typography>
      ) : null}
    </Dialog>
  );
}

export default LoadingDialog;
