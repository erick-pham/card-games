import Head from "next/head";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { getProviders, signIn, useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { FacebookIcon, GoogleIcon } from "../admin/icons";
export default function SignIn({
  providers,
  csrfToken,
}: {
  providers: any;
  csrfToken: string | "";
}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    if (router.query["callbackUrl"]) {
      router.push(router.query["callbackUrl"] + "");
    }
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          // position: "fixed",
          // top: "50%",
          // left: "50%",
          // alignItems: "center",
          // display: "flex",
          // flexGrow: 1,
          // minHeight: "100%",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Sign in
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Sign in on the internal platform
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {/* {providers && providers.facebook && (
              <Grid item xs={12} md={6}>
                <Button
                  color="info"
                  fullWidth
                  startIcon={<FacebookIcon />}
                  onClick={() => signIn(providers.facebook.id)}
                  size="large"
                  variant="contained"
                >
                  Login with Facebook
                </Button>
              </Grid>
            )} */}
            {providers && providers.google && (
              <Grid item xs={12} md={12}>
                <Button
                  color="error"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={() => signIn(providers.google.id)}
                  size="large"
                  variant="contained"
                >
                  Login with Google
                </Button>
              </Grid>
            )}
          </Grid>

          {/* <form method="post" action="/api/auth/signin/email">
            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                or login with email address
              </Typography>
            </Box>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              name="email"
              type="email"
              variant="outlined"
              required={true}
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
          </form> */}
        </Container>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken: csrfToken || "" },
  };
}
