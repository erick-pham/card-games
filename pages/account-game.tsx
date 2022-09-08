import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
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
  Item,
} from "@mui/material";
import numeral from "numeral";
import SellIcon from "@mui/icons-material/Sell";
import product from "./api/product";
function Home() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/public/product")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === true) {
          dispatch(
            setErrorState({
              message: data.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          setProducts(data);
        }
      })
      .finally(() => {
        dispatch(
          setLoadingState({
            loading: false,
            loadingMessage: null,
          })
        );
      });
  }, [dispatch]);
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

      <Container style={{ marginTop: 10 }}>
        <ListCard products={products}></ListCard>
      </Container>
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

// export async function getServerSideProps() {
//   const uow = new UnitOfWork();
//   await uow.initialize();

//   const products = await uow.ProuductRepository.find({
//     relations: {
//       productItems: true,
//     },
//   });

//   return {
//     props: { products: products.map((p) => p.toJSON()) },
//   };
// }
export default Home;
