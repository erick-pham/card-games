import "reflect-metadata";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Alert, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import {
  selectErrorState,
  setErrorState,
  selectLoadingState,
  selectLoadingMessageState,
} from "../app/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../app/store";
import LoadingDialog from "./components/LoadingDialog";

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const error = useSelector(selectErrorState);
  const loading = useSelector(selectLoadingState);
  const loadingMessage = useSelector(selectLoadingMessageState);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isEmpty(error.message)) {
      setOpen(true);
    }
  }, [error.message]);

  const handleErrorSnackbarClose = () => {
    dispatch(setErrorState({ message: "", values: "", severity: "error" }));
    setOpen(!open);
  };

  return (
    <div>
      <LoadingDialog
        isLoading={loading}
        message={loadingMessage.id ? loadingMessage.defaultMessage : null}
      ></LoadingDialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        // autoHideDuration={30000}
        onClose={handleErrorSnackbarClose}
      >
        <Alert
          onClose={handleErrorSnackbarClose}
          variant="filled"
          severity={error.severity}
        >
          {error.message}
        </Alert>
      </Snackbar>
      <Component {...pageProps} />
    </div>
  );
}
// export default MyApp;
export default wrapper.withRedux(MyApp);
