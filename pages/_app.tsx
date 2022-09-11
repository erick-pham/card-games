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
import Script from "next/script";

const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
const ATTRIBUTION = process.env.NEXT_PUBLIC_FACEBOOK_ATTRIBUTION;

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
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script
        id="fb-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          var chatbox = document.getElementById('fb-customer-chat');
          chatbox.setAttribute("page_id", "${FACEBOOK_PAGE_ID}");
          chatbox.setAttribute("attribution", "${ATTRIBUTION}");
          window.fbAsyncInit = function() {
            FB.init({
              xfbml            : true,
              version          : 'v14.0'
            });
          };
      
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
          `,
        }}
      />
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
