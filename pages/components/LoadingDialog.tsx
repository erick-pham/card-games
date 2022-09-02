import React from "react";
import styled from "styled-components";
import { Dialog, CircularProgress, Typography } from "@mui/material";

const StyledDialog = styled((props) => (
  <Dialog
    {...props}
    classes={{
      paper: "paper",
    }}
  />
))`
  & .paper {
    display: flex;
    align-items: center;
    overflow: visible;
    background-color: transparent;
    text-align: center;
    box-shadow: none;
    color: #ffffff;
  }
`;

function LoadingDialog(props: { isLoading: boolean; message: string | null }) {
  return (
    <StyledDialog open={props.isLoading}>
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
    </StyledDialog>
  );
}

export default LoadingDialog;
