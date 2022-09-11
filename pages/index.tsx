import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import ListCard from "./components/CardList";
import Container from "@mui/material/Container";
import { Product } from "../interfaces/entity/product";

import { setErrorState, setLoadingState } from "../app/rootSlice";
import message from "../common/messages";
import {
  CardMedia,
  CardActions,
  Box,
  Card,
  CardHeader,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

function Home() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  // useEffect(() => {
  //   dispatch(
  //     setLoadingState({
  //       loading: true,
  //       loadingMessage: message.appAPILoading,
  //     })
  //   );
  //   fetch("/api/public/product")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error === true) {
  //         dispatch(
  //           setErrorState({
  //             message: data.message,
  //             values: "",
  //             severity: "error",
  //           })
  //         );
  //       } else {
  //         setProducts(data);
  //       }
  //     })
  //     .finally(() => {
  //       dispatch(
  //         setLoadingState({
  //           loading: false,
  //           loadingMessage: null,
  //         })
  //       );
  //     });
  // }, [dispatch]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Mua bán account games</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Container maxWidth={false}> */}
      <NavBar></NavBar>
      {/* </Container> */}
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 8 }}>
          <Card
            variant="outlined"
            style={{
              padding: 0,
              border: "none",
              boxShadow: "none",
              backgroundColor: "#1B3447",
            }}
          >
            <CardMedia
              component="img"
              height="450"
              width="auto"
              image="/static/images/banner1.1.jpg"
              alt=""
            />

            <CardHeader
              title="Mua bán tài khoản game uy tín"
              titleTypographyProps={{
                color: "red",
                fontSize: 28,
                textAlign: "center",
              }}
              subheaderTypographyProps={{ color: "#B6B6B6" }}
            />
          </Card>
        </Box>
      </Container>

      <Container style={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card
              variant="outlined"
              style={{
                padding: 0,
                border: "none",
                boxShadow: "none",
                backgroundColor: "#1B3447",
              }}
            >
              <CardHeader
                title="Mua Acc game"
                titleTypographyProps={{
                  color: "red",
                  fontSize: 36,
                  textAlign: "center",
                }}
                subheader="với kho acc game cực kì hấp dẫn"
                subheaderTypographyProps={{
                  color: "red",
                  fontSize: 24,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                height="250"
                width="auto"
                image="/static/images/card-img1.1.jpg"
                alt=""
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <Link href={"/account-game"}>
                  <Button
                    variant="contained"
                    style={{
                      width: "auto",
                      color: "black",
                      backgroundColor: "#FFC107",
                      fontWeight: "bold",
                    }}
                  >
                    MUA NGAY
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card
              variant="outlined"
              style={{
                padding: 0,
                border: "none",
                boxShadow: "none",
                backgroundColor: "#1B3447",
              }}
            >
              <CardHeader
                title="Nạp game"
                titleTypographyProps={{
                  color: "red",
                  fontSize: 36,
                  textAlign: "center",
                }}
                subheader="Chiết khấu cao - bảo hành trọn đời"
                subheaderTypographyProps={{
                  color: "red",
                  fontSize: 24,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                height="250"
                width="auto"
                image="/static/images/card-img1.2.jpg"
                alt=""
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "auto",
                    color: "black",
                    backgroundColor: "#FFC107",
                    fontWeight: "bold",
                  }}
                >
                  NẠP NGAY
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: 4, marginBottom: 4 }}>
        {/* <Box
          style={{
            marginTop: 20,
            backgroundColor: "red",
          }}
        > */}
        <Container
          style={{
            backgroundColor: "#5CE1E6",
          }}
        >
          <Box sx={{ marginTop: 8 }}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Typography
                  variant="h5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <LockIcon sx={{ fontSize: 40 }} /> Secure Transactions
                </Typography>
                <Typography align="justify">
                  Feel confident each time you transact with us. GamerProtect
                  comes with SSL protection and wide range of payment processors
                  under a safe and secured platform.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Typography
                  variant="h5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <SupportAgentIcon sx={{ fontSize: 40 }} /> Customer Support
                </Typography>
                <Typography align="justify">
                  Our dedicated Customer Service team are available to help with
                  any queries about your orders and provide exceptional
                  after-sales support.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Typography
                  variant="h5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <MonetizationOnIcon sx={{ fontSize: 36 }} />
                  Best Offers
                </Typography>
                <Typography align="justify">
                  G2G provides competitive pricing to the buyers driven by a
                  free market economy while striving to keep the cost low for
                  our sellers.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* </Box> */}
      </Container>
      {/* <Container maxWidth={false} style={{ marginTop: 10 }}>
        <ListCard products={products}></ListCard>
      </Container> */}
      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}

Home.auth = true;
export default Home;
