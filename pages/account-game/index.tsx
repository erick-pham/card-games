import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "styles/Home.module.css";
import NavBar from "../components/NavBar";
import ListCard from "../components/CardList";
import Container from "@mui/material/Container";
import { Product } from "database/entity/product";
import MyFooter from "../components/MyFooter";
import { setErrorState, setLoadingState } from "../../app/rootSlice";
import message from "common/messages";

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
    fetch("/api/public/account-games")
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
      <NavBar></NavBar>

      <Container style={{ marginTop: 10 }}>
        <ListCard products={products}></ListCard>
      </Container>

      <MyFooter />
    </div>
  );
}

export default Home;