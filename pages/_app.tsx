import "reflect-metadata";
import "../styles/globals.css";
import "components/RichTextEditor/RichTextEditor.css";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { Alert, Snackbar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
import {
  selectErrorState,
  setErrorState,
  selectLoadingState,
  selectLoadingMessageState,
  selectThemeModeState,
  setThemeModeState,
} from "reduxjs/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "reduxjs/store";
import LoadingDialog from "components/LoadingDialog";
import { themeLight, themeDark } from "theme";
import createEmotionCache from "theme/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import Script from "next/script";
const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
const ATTRIBUTION = process.env.NEXT_PUBLIC_FACEBOOK_ATTRIBUTION;
const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  emotionCache: any;
  pageProps: any;
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const error = useSelector(selectErrorState);
  const loading = useSelector(selectLoadingState);
  const loadingMessage = useSelector(selectLoadingMessageState);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isEmpty(error.message)) {
      setOpen(true);
    }
  }, [error.message]);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, []);

  const handleErrorSnackbarClose = () => {
    dispatch(setErrorState({ message: "", values: "", severity: "error" }));
    setOpen(!open);
  };
  const getLayout = Component?.getLayout ?? ((page: any) => page);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeMode = useSelector(selectThemeModeState);

  useEffect(() => {
    if (prefersDarkMode) {
      dispatch(setThemeModeState("dark"));
    }
  }, []);

  useEffect(() => {
    const mode = localStorage.getItem("theme");
    if (mode === "dark") {
      dispatch(setThemeModeState("dark"));
    }

    if (mode === "light") {
      dispatch(setThemeModeState("light"));
    }
  }, []);

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
        isLoading={loading || isLoading}
        message={loadingMessage.id ? loadingMessage.defaultMessage : null}
      ></LoadingDialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={5000}
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
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={themeMode === "dark" ? themeDark : themeLight}>
          <CssBaseline />
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
      </CacheProvider>
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

  if (auth.required !== true) {
    return children;
  }

  if (status === "loading") {
    return <LinearProgress></LinearProgress>;
  } else if (status === "authenticated") {
    if (auth.role && auth.role === session.userRole) {
      return children;
    }
    router.push("/access-denied");
  } else if (status === "unauthenticated") {
    router.push("/access-denied");
  } else {
    return null;
  }
}

export default wrapper.withRedux(MyApp);
