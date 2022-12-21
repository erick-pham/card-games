import Router from "next/router";
import { GetServerSideProps } from "next";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
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
  CardMedia,
  Tooltip,
  Grid,
  FormHelperText,
  Input,
} from "@mui/material";
import numeral from "numeral";

import {
  setErrorState,
  setLoadingState,
  setDialogImageState,
} from "app/rootSlice";
import message from "common/messages";
import { ProductItem } from "database/entity/product_item";
import { getSessionUserInfo } from "@utils/get-session-user";
import { ajvResolver } from "validator/ajvResolver";
import { SubmitAccountOrderValidation } from "validator/validationSchema/client-orders";
import { isEmpty } from "lodash";
import { PRODUCT_ITEM_STATUS } from "common/constants";
import UnitOfWork from "database/unit-of-work";

import NotFoundData from "pages/components/NotFoundData";
import DialogImage from "pages/components/DialogImage";
import MainLayout from "pages/components/MainLayout";

type SubmitAccountOrderType = {
  productItemId: string;
  contactName: string,
  contactEmail: string,
  contactPhoneNumber: string;
  description: string;
};


const AccountGameCheckOutPage = ({ productItem }: { productItem: ProductItem }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  let userInfo = getSessionUserInfo(session);

  let defaultValues = {
    productItemId: productItem?.id || '',
    contactName: userInfo?.name || '',
    contactEmail: userInfo?.email || '',
    contactPhoneNumber: userInfo?.phoneNumber || '',
    description: '',
  };

  const { handleSubmit, control, getValues, formState: { errors } } = useForm<SubmitAccountOrderType>({
    resolver: ajvResolver(SubmitAccountOrderValidation),
    defaultValues
  });

  const onSubmit = (data: object) => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/public/account-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        productItemId: productItem.id,
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
          Router.push(`/history-order?referenceNumber=${data.referenceNumber}`);
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

  const handleClickImage = () => {
    dispatch(setDialogImageState({ open: true, url: productItem?.thumbnail }));
  };

  if (!productItem) {
    return <NotFoundData></NotFoundData>;
  }

  return (
    <div>
      <DialogImage></DialogImage>
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
              title={"Thông tin đặt hàng"}
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                    Đặc điểm: {productItem.description}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{ fontWeight: "bold" }}
                  >
                    Giá: {`${numeral(productItem.price).format("0,0")} ${productItem.currency}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Tooltip
                    title="click để xem ảnh lớn hơn"
                    placement="top"
                    open={true}
                  >
                    <CardMedia
                      component="img"
                      // height="200"
                      // width="auto"
                      image={productItem.thumbnail}
                      alt="alt"
                      sx={{
                        height: 200,
                        width: 200,
                      }}
                      onClick={handleClickImage}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
              <Divider></Divider>
              <Typography gutterBottom variant="h5" component="div">Thông tin liên hệ:</Typography>
              <form autoComplete="off">
                <Controller
                  name="productItemId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      type="hidden"
                    />
                  )}
                />

                <Controller
                  name="contactName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}

                        label="Họ Tên"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                />

                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField
                        {...field}

                        label="Email"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                />

                <Controller
                  name="contactPhoneNumber"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <TextField

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

                        label="Ghi chú"
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    </FormControl>
                  )}
                />

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
                    Mua ngay
                  </Button>
                  <FormHelperText>{!isEmpty(errors) ? 'Thông tin không lợp lệ!' : ''}</FormHelperText>
                </FormControl>
              </form>
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

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  try {
    const { params, req, res, query } = context;
    let productItemData = null;

    if (query.productItemId) {
      const uow = new UnitOfWork();
      await uow.initialize();
      const data = await uow.ProuductItemRepository.findOne({
        where: {
          id: query?.productItemId as string || '',
          status: PRODUCT_ITEM_STATUS.SELLING
        }
      });
      // const data = await uow.OrderRepository.findOneBy({
      //   referenceNumber: query?.referenceNumber as string || ''
      // });

      const productItemData = JSON.parse(JSON.stringify(data));
      return {
        props: { productItem: productItemData },
      };
    } else {
      return {
        props: { productItem: productItemData },
      };
    }
  } catch (error) {
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

AccountGameCheckOutPage.getLayout = (page: any) => <MainLayout pageTitle='Chi tiết tài khoản'>{page}</MainLayout>;
export default AccountGameCheckOutPage;
