/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AccessDenied = () => (
  <>
    <Head>
      <title>403 - Access denied</title>
    </Head>
    <Box>
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography align="center" color="error" variant="h1">
            403 ACCESS DENIED
          </Typography>
          <Typography align="center" color="info.main" variant="h2">
            Oops, You DO NOT have permission to access this page.
          </Typography>

          <NextLink href="/" passHref>
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to home
            </Button>
          </NextLink>
        </Box>
      </Container>
    </Box>
  </>
);

export default AccessDenied;
