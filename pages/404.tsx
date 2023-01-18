/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFoundPage = () => (
  <>
    <Head>
      <title>404 - Page not found</title>
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
            404: PAGE NOT FOUND
          </Typography>
          <Typography align="center" color="info.main" variant="h2">
            Oops! The page you are looking for isn’t here.
          </Typography>

          <NextLink href="/" passHref>
            <Button
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

export default NotFoundPage;
