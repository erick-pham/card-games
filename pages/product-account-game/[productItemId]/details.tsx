import Router from "next/router";
import { GetServerSideProps } from "next";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import {
  Typography,
  Container,
  FormControl,
  TextField,
  Button,
  Grid,
  FormHelperText,
  Input,
} from "@mui/material";

import { setErrorState, setLoadingState } from "reduxjs/rootSlice";
import message from "common/messages";
import { ProductItemType } from "pages/product-account-game";
import { getSessionUserInfo } from "@utils/get-session-user";
import { ajvResolver } from "validator/ajvResolver";
import { SubmitAccountOrderValidation } from "validator/validationSchema/client-orders";
import { isEmpty } from "lodash";
import { PRODUCT_ITEM_STATUS } from "common/constants";
import UnitOfWork from "database/unit-of-work";

import NotFoundData from "components/NotFoundData";
import MainLayout from "components/MainLayout";
import StyledMainBox from "components/CustomStyledBox";

import ProductDetail from "components/ProductDetail";
import checkValidSalePrice from "@utils/check-valid-sale-price";

type SubmitAccountOrderType = {
  productItemId: string;
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  description: string;
};

const AccountGameDetailPage = ({
  productItem,
}: {
  productItem: ProductItemType;
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  let userInfo = getSessionUserInfo(session);
  const isItemSold = productItem?.status === PRODUCT_ITEM_STATUS.SOLD;
  const isItemUnAvailable = productItem?.status !== PRODUCT_ITEM_STATUS.SELLING;
  let defaultValues = {
    productItemId: productItem?.id || "",
    contactName: userInfo?.name || "",
    contactEmail: userInfo?.email || "",
    contactPhoneNumber: userInfo?.phoneNumber || "",
    description: "",
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<SubmitAccountOrderType>({
    resolver: ajvResolver(SubmitAccountOrderValidation),
    defaultValues,
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

  if (!productItem) {
    return <NotFoundData></NotFoundData>;
  }

  return (
    <div>
      <Container style={{ marginTop: 10 }}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
            <StyledMainBox>
              <ProductDetail productItem={productItem}></ProductDetail>
            </StyledMainBox>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <StyledMainBox>
              <Typography variant="h5" fontWeight={800}>
                Thông tin liên hệ
              </Typography>
              <form autoComplete="off">
                <Controller
                  name="productItemId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input {...field} type="hidden" />
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
                        disabled={isItemUnAvailable}
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
                        disabled={isItemUnAvailable}
                        type={"email"}
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
                        disabled={isItemUnAvailable}
                        type={"tel"}
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
                        disabled={isItemUnAvailable}
                      />
                    </FormControl>
                  )}
                />

                <FormControl
                  fullWidth
                  error={!isEmpty(errors)}
                  variant="standard"
                >
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
                    disabled={isItemUnAvailable}
                  >
                    {isItemSold
                      ? "Đã bán"
                      : isItemUnAvailable
                      ? "Chưa sẵng sàng"
                      : "Mua ngay"}
                  </Button>
                  <FormHelperText>
                    {!isEmpty(errors) ? "Thông tin không lợp lệ!" : ""}
                  </FormHelperText>
                </FormControl>
              </form>
              <Typography
                variant="h6"
                color="text.primaryRed"
                sx={{ fontStyle: "italic", mt: 2 }}
              >
                *NOTE: Sau khi bạn đặt hàng, vui lòng liên hệ fanpage hoặc
                hotline để được shop liên hệ chuyển khoản và giao tài khoản. Xin
                Cảm ơn!
              </Typography>
            </StyledMainBox>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { params, req, res, query } = context;
    context.res.setHeader("Cache-Control", "no-cache");
    let productItemData = null;

    if (query.productItemId) {
      const uow = new UnitOfWork();
      await uow.initialize();
      const data = await uow.ProuductItemRepository.findOne({
        where: {
          id: (query?.productItemId as string) || "",
        },
      });

      let productItemData = JSON.parse(JSON.stringify(data));

      if (
        checkValidSalePrice(
          productItemData.salePrice,
          productItemData.salePriceEndDate
        )
      ) {
        productItemData.isSale = true;
      } else {
        productItemData.isSale = false;
      }
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

AccountGameDetailPage.auth = {};
AccountGameDetailPage.getLayout = (page: any) => (
  <MainLayout pageTitle="Chi tiết account">{page}</MainLayout>
);
export default AccountGameDetailPage;
