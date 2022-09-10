import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Container,
  CardContent,
  FormControl,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import { useSession } from "next-auth/react";
import styles from "../../../styles/Home.module.css";
import NavBar from "../../components/NavBar";
import { setErrorState, setLoadingState } from "../../../app/rootSlice";
import message from "../../../common/messages";
import { useRouter } from "next/router";
import { ProductItem } from "../../../interfaces/entity/product_item";

interface UserData extends Record<string, unknown> {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  phoneNumber?: string | null | undefined;
}

function UserPreOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const [submittedOrder, setSubmittedOrder] = useState<any>();
  const [productItem, setProductItem] = useState<ProductItem>();
  const { productItemId } = router.query;

  let user: UserData = {
    ...session?.user,
    phoneNumber: session?.userPhoneNumber as string,
  };

  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch(`/api/product-item/${productItemId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.error === true) {
          dispatch(
            setErrorState({
              message: data?.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          setProductItem(data);
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
  }, [dispatch, productItemId]);

  const { control, handleSubmit, reset, register } = useForm({
    // resolver: ajvResolver(schema),
  });

  const onSubmit = (data: object) => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        productItemId: productItemId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.error === true) {
          dispatch(
            setErrorState({
              message: data.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          setSubmittedOrder(data);
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
  };

  if (!productItem) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Mua bán account games</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar></NavBar>
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
            <CardHeader
              title={
                submittedOrder ? "Đặt hàng thành công" : "Thông tin đặt hàng"
              }
              titleTypographyProps={{
                color: "red",
                fontSize: 28,
                textAlign: "center",
              }}
              subheaderTypographyProps={{ color: "#B6B6B6" }}
            />
            <CardContent
              style={{
                backgroundColor: "#fff",
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                Đơn hàng:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Loại: {productItem.type}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tên sản phẩm: {productItem.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Giá:{" "}
                {numeral(productItem.price).format("0,0") +
                  " " +
                  productItem.currency}
              </Typography>
              <Divider></Divider>
              <Typography gutterBottom variant="h5" component="div">
                {submittedOrder ? "Thông tin đặt hàng" : "Thông tin liên hệ:"}
              </Typography>

              {submittedOrder ? (
                <>
                  <Typography variant="body1" color="text.secondary">
                    Họ Tên: {user?.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Email: {user?.email}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mã đơn: {submittedOrder?.referenceNumber}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ngày tạo:{" "}
                    {format(new Date(submittedOrder?.createdAt), "dd-MMM-yyyy")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Trạng thái: {submittedOrder?.status}
                  </Typography>
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <Controller
                    name="name"
                    control={control}
                    defaultValue={user?.name}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField
                          {...field}
                          id="outlined-multiline-flexible"
                          label="Họ Tên"
                          disabled={true}
                          error={error ? true : false}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={user?.email}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField
                          {...field}
                          id="outlined-multiline-flexible"
                          label="Email"
                          disabled={true}
                          error={error ? true : false}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue={user?.phoneNumber}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Số điện thoại"
                          onChange={onChange}
                          value={value}
                          error={error ? true : false}
                          helperText={error?.message}
                        ></TextField>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    defaultValue={""}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <TextField
                          {...field}
                          id="outlined-multiline-flexible"
                          label="Ghi chú"
                          error={error ? true : false}
                          helperText={error?.message}
                        />
                      </FormControl>
                    )}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: 4 }}
                    type="submit"
                  >
                    Mua ngay
                  </Button>
                </form>
              )}
              <Typography
                variant="h6"
                color="error.main"
                sx={{ fontStyle: "italic", mt: 4 }}
              >
                *NOTE: Sau khi bạn đặt hàng, vui lòng liên hệ fanpage hoặc
                hotline để được shop liên hệ chuyển khoản và giao tài khoản. Xin
                Cảm ơn!
              </Typography>
            </CardContent>
            {/* <CardMedia
              component="img"
              height="auto"
              width="auto"
              image="/static/images/banner.jpg"
              alt=""
            /> */}
          </Card>
        </Box>
      </Container>
    </div>
  );
}

UserPreOrder.auth = {
  required: true,
};
export default UserPreOrder;
