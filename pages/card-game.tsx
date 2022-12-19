import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import ErrorPage from "next/error";
import { useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import NavBar from "./components/NavBar";
import {
  Container,
  Box,
  styled,
  Grid,
  FormControl,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormHelperText,
} from "@mui/material";
import { ajvResolver } from "validator/ajvResolver";
import { SubmitCardOrderValidation } from "validator/validationSchema/client-orders";
import MyFooter from "./components/MyFooter";
import { setErrorState, setLoadingState } from "../app/rootSlice";
import message from "common/messages";
import { Controller, useForm } from "react-hook-form";
import { Product } from "database/entity/product";
import UnitOfWork from "database/unit-of-work";
import { PRODUCT_ITEM_TYPES, PRODUCT_ITEM_STATUS } from "common/constants";
import { isEmpty } from "lodash";
import { getSessionUserInfo, SessionUser } from "utils/get-session-user";

import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Router from 'next/router'

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 5,
  padding: 18,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  variant: "h5",
  align: "center",
  color: "#008B88",
}));

export const getServerSideProps: GetServerSideProps<CardGamePageProps> = async (
  context
) => {
  try {
    const { params, req, res } = context;
    const session = await unstable_getServerSession(context.req, context.res, authOptions)
    const userInfo = getSessionUserInfo(session);

    // const response = await fetch(`http://localhost:3000/api/public/card-games`);
    const uow = new UnitOfWork();
    await uow.initialize();
    const data = await uow.ProuductRepository.find({
      where: {
        productItems: {
          type: PRODUCT_ITEM_TYPES.CARD_GAME,
          status: PRODUCT_ITEM_STATUS.SELLING,
        },
      },
      relations: {
        productItems: true,
      },
    });
    const productCardGames = JSON.parse(JSON.stringify(data));
    return {
      props: { productCardGames, userInfo },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

type SubmitCardOrderType = {
  productItemId: string;
  productId: string;
  accountUserId: string;
  accountName: string;
  accountPassword: string;
  accountServer: string;
  accountCharacterName: string;
  contactName: string,
  contactEmail: string,
  contactPhoneNumber: string;
  description: string;
};

type CardGamePageProps = {
  internalError?: boolean;
  statusCode?: number;
  productCardGames?: Product[];
  userInfo?: SessionUser | null
};

const CardGamePage: NextPage = ({
  internalError,
  statusCode,
  productCardGames,
  userInfo
}: CardGamePageProps) => {
  const dispatch = useDispatch();

  let defaultValues = {
    productId: '',
    productItemId: '',
    accountUserId: '',
    accountName: '',
    accountPassword: '',
    accountServer: '',
    accountCharacterName: '',
    contactName: userInfo?.name || '',
    contactEmail: userInfo?.email || '',
    contactPhoneNumber: userInfo?.phoneNumber || '',
    description: '',
  };

  const { handleSubmit, control, watch, formState: { errors } } = useForm<SubmitCardOrderType>({
    resolver: ajvResolver(SubmitCardOrderValidation),
    defaultValues
  });

  const watchShowGame = watch("productId", ''); // you can supply default value as second argument

  const onSubmit = async (data: SubmitCardOrderType) => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );

    const payload = data as SubmitCardOrderType;

    fetch("/api/public/card-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        productId: payload?.productId,
        productItemId: payload.productItemId,
      })
    })
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
          // setOrderReferenceNumberSubmitted(data.referenceNumber);
          Router.push(`/order-result?referenceNumber=${data.referenceNumber}`)
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

  const renderPackage = (activeProductId: string) => {
    const product = productCardGames?.find((i) => i.id === activeProductId);

    const productItems = product?.productItems || [
      {
        id: "id",
        name: "No data",
      },
    ];
    return productItems.map((option) => (
      <MenuItem key={option.id} value={option.id}>
        {option.name}
      </MenuItem>
    ));
  };

  if (internalError && statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Mua bán tài khoản games</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar></NavBar>

      <Container style={{ marginTop: 10 }}>
        <StyledBox>
          <Grid container>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <StyledTitle variant="h5" align="center" color="#008B88">
                Nhập thông tin NẠP GENSHIN IMPACT
              </StyledTitle>
              <form autoComplete="off">
                <Controller
                  name="productId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Game"
                        select={true}
                        onChange={onChange}
                        variant="filled"
                        size="small"
                        value={value}
                        error={error ? true : false}
                        helperText={error?.message}
                      >
                        {productCardGames?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  )} />

                <Controller
                  name="productItemId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Gói nạp"
                        select={true}
                        onChange={onChange}
                        variant="filled"
                        size="small"
                        value={value || ""}
                        error={error ? true : false}
                        helperText={error?.message}
                      >
                        {renderPackage(watchShowGame)}
                      </TextField>
                    </FormControl>
                  )} />

                <Controller
                  name="accountUserId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (<FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <TextField
                      {...field}
                      id="outlined-multiline-flexible"
                      label="User ID"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                  )} />

                <Controller
                  name="accountName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Tên tài khoản"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />

                <Controller
                  name="accountPassword"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Mật khẩu"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />

                <Controller
                  name="accountServer"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Server"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />

                <Controller
                  name="accountCharacterName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Tên nhân vật"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />

                <Typography variant="h6" align="left" color="#008B88">
                  Thông tin liên hệ
                </Typography>
                <Controller
                  name="contactName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Họ Tên"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />
                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Địa chỉ email"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />
                <Controller
                  name="contactPhoneNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Số điện thoại"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />

                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}
                        id="outlined-multiline-flexible"
                        label="Ghi chú"
                        variant="filled"
                        size="small"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )} />
                <FormControl error={!isEmpty(errors)} variant="standard">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      margin: 4,
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Gửi yêu cầu
                  </Button>
                  <FormHelperText>{!isEmpty(errors) ? 'Thông tin không lợp lệ!' : ''}</FormHelperText>
                </FormControl>
              </form>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <StyledTitle variant="h5" align="center" color="#008B88">
                Hướng dẫn NẠP GENSHIN IMPACT
              </StyledTitle>
              <Box p={2}>
                <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                  📛 Giá nạp hiện đã ổn định các bạn nên đơn ok nhé
                </Typography>
                <Typography
                  style={{
                    color: "red",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                  component="h1"
                >
                  BÀI CÁC CÂU HỎI VỀ NẠP:
                </Typography>

                <Typography
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Link check tài khoản đúng hay chưa
                </Typography>
                <Typography
                  style={{
                    backgroundColor: "yellow",
                    fontWeight: "bold",
                  }}
                >
                  https://account.mihoyo.com/#/account/loginDevices
                </Typography>
                <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                  📛Đơn nạp khi nên không thể xong được ngay cần đợi xử lý
                </Typography>
                <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                  📛Nếu đơn hủy tiền sẽ được hoàn về tài khoản các bạn
                </Typography>
                <Typography style={{}}>
                  📛Tài khoản và mật khẩu nên đơn phải là tài khoản Mihoyo ko
                  lên = FB - Google<br></br>
                  📛UID là UID các bạn vẫn dùng kết bạn<br></br>
                  📛Các gói nạp chưa tính x2 nếu có <br></br>
                  📛 Hãy cung cấp mã đăng nhập khi shop liên hệ lấy mã login
                  trong thư maill <br></br>
                  📛 Nếu không có SĐT hãy điền link fb hoặc zalo ở mục ghi chú
                </Typography>

                <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                  📛 Một số lý do khi đơn của bạn bị hủy
                </Typography>
                <Typography>
                  - Sai tài khoản hoặc mật khẩu <br></br>- Số điện thoại không
                  liên hệ được <br></br>- Call nhưng không nghe máy <br></br>-
                  Không nạp tài khoản Facebook
                </Typography>
                <Typography style={{}}>📛 Bảo hành nạp 100%</Typography>
                <Typography style={{}}>
                  📛 Mọi thông tin nạp nếu không hiểu hãy ib cho Fanpage
                </Typography>
                <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                  ❇️ Lưu ý : Khi nạp thành công đơn hãy đổi mật khẩu để đảm bảo
                  an toàn!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
      </Container>

      <MyFooter />
    </div>
  );
};

export default CardGamePage;