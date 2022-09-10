import "reflect-metadata";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { Alert, Snackbar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
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
import { theme } from "../theme";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}) {
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
  const getLayout = Component?.getLayout ?? ((page: any) => page);
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
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          {Component.auth ? (
            <Auth auth={Component.auth}>
              {getLayout(<Component {...pageProps} />)}
            </Auth>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
        </SessionProvider>
      </ThemeProvider>
    </div>
  );
}
// export default MyApp;
function Auth({ children, auth }: { children: any; auth: any }) {
  const router = useRouter();
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: session, status } = useSession({
    required: auth.required || false,
    // onUnauthenticated() {
    //   return unauthorized
    // },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    if (auth.role && auth.role !== session.userRole) {
      router.push("/access-denied");
    }
  }

  return children;
}

export default wrapper.withRedux(MyApp);
