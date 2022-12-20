import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ListCard from "pages/components/CardList";
import Container from "@mui/material/Container";
import { Product } from "database/entity/product";
import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import MainLayout from "pages/components/MainLayout";

const AccountGamePage = () => {
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
    <Container style={{ marginTop: 10 }}>
      <ListCard products={products}></ListCard>
    </Container>
  );
}

AccountGamePage.getLayout = (page: any) => <MainLayout pageTitle='Mua tài khoản games'>{page}</MainLayout>;
export default AccountGamePage;
