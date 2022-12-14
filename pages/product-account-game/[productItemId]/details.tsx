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

import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import ProductItemEntity from "@database/entity/product_item";
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
  productItem: ProductItemEntity;
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  let userInfo = getSessionUserInfo(session);
  const isItemSold = productItem?.status === PRODUCT_ITEM_STATUS.SOLD;
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
                Th??ng tin li??n h???
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
                        label="H??? T??n"
                        error={error ? true : false}
                        helperText={error?.message}
                        disabled={isItemSold}
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
                        disabled={isItemSold}
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
                        label="S??? ??i???n tho???i"
                        onChange={onChange}
                        value={value}
                        error={error ? true : false}
                        helperText={error?.message}
                        disabled={isItemSold}
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
                        label="Ghi ch??"
                        error={error ? true : false}
                        helperText={error?.message}
                        disabled={isItemSold}
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
                    disabled={isItemSold}
                  >
                    {isItemSold ? "???? b??n" : "Mua ngay"}
                  </Button>
                  <FormHelperText>
                    {!isEmpty(errors) ? "Th??ng tin kh??ng l???p l???!" : ""}
                  </FormHelperText>
                </FormControl>
              </form>
              <Typography
                variant="h6"
                color="text.primaryRed"
                sx={{ fontStyle: "italic", mt: 2 }}
              >
                *NOTE: Sau khi b???n ?????t h??ng, vui l??ng li??n h??? fanpage ho???c
                hotline ????? ???????c shop li??n h??? chuy???n kho???n v?? giao t??i kho???n. Xin
                C???m ??n!
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
    let productItemData = null;

    if (query.productItemId) {
      const uow = new UnitOfWork();
      await uow.initialize();
      const data = await uow.ProuductItemRepository.findOne({
        where: {
          id: (query?.productItemId as string) || "",
        },
      });

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

AccountGameDetailPage.auth = {};
AccountGameDetailPage.getLayout = (page: any) => (
  <MainLayout pageTitle="Chi ti???t account">{page}</MainLayout>
);
export default AccountGameDetailPage;
