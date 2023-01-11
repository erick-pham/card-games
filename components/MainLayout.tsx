import Head from "next/head";
import { Box, Container } from "@mui/material";
import styles from "styles/Home.module.css";
import NavBar from "components/NavBar";
import MyFooter from "components/MyFooter";

export const MainLayout = (props: { children: any; pageTitle: string }) => {
  const { children, pageTitle } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NavBar></NavBar>
        <Container>{children}</Container>
        <MyFooter></MyFooter>
      </Box>
    </div>
  );
};

export default MainLayout;
