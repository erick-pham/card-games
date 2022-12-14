import Router, { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { unstable_getServerSession } from "next-auth/next";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
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

import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import { Controller, useForm } from "react-hook-form";
import ProductEntity from "@database/entity/product";

import UnitOfWork from "database/unit-of-work";
import { PRODUCT_ITEM_TYPES, PRODUCT_ITEM_STATUS } from "common/constants";
import { isEmpty } from "lodash";
import { getSessionUserInfo, SessionUser } from "utils/get-session-user";

import { authOptions } from "pages/api/auth/[...nextauth]";
import MainLayout from "components/MainLayout";
import { StyledMainBox } from "components/CustomStyledBox";
import ProductDetail from "components/ProductDetail";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<CardGamePageProps> = async (
  context
) => {
  try {
    const { params, req, res } = context;
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
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
    console.error(error);
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

type ProductItemType = {
  id: string;
  name: string;
  referenceNumber: string;
  price: number;
  currency: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  status: string;
};

type SubmitCardOrderType = {
  productItemId: string;
  productId: string;
  accountUserId: string;
  accountName: string;
  accountPassword: string;
  accountServer: string;
  accountCharacterName: string;
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  description: string;
};

type CardGamePageProps = {
  internalError?: boolean;
  statusCode?: number;
  productCardGames?: ProductEntity[];
  userInfo?: SessionUser | null;
};

const CardGamePage = ({
  internalError,
  statusCode,
  productCardGames,
  userInfo,
}: CardGamePageProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { game, itemId } = router.query as { game: string; itemId: string };
  const selectedProduct = productCardGames?.find((i) => i.id === game);
  const selectedItem = selectedProduct?.productItems?.find(
    (i) => i.id === itemId
  );

  const [productItemList, setProductItemList] = useState(
    selectedProduct?.productItems
  );

  let defaultValues = {
    productId: String(game) || "",
    productItemId: String(itemId) || "",
    accountUserId: "",
    accountName: "",
    accountPassword: "",
    accountServer: "",
    accountCharacterName: "",
    contactName: userInfo?.name || "",
    contactEmail: userInfo?.email || "",
    contactPhoneNumber: userInfo?.phoneNumber || "",
    description: "",
  };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SubmitCardOrderType>({
    resolver: ajvResolver(SubmitCardOrderValidation),
    defaultValues,
  });

  // const watchShowGame = watch("productId", ""); // you can supply default value as second argument

  const [productItem, setProductItem] = useState<ProductItemType | undefined>(
    selectedItem
  );

  watch((data, { name, type }) => {
    if (name === "productId") {
      const selectedProduct = productCardGames?.find(
        (i) => i.id === data.productId
      );
      if (selectedProduct) {
        router.replace({
          query: { ...router.query, game: selectedProduct?.id, itemId: "" },
        });
        setProductItemList(selectedProduct?.productItems);
      } else {
        setProductItemList(undefined);
      }
    }

    if (name === "productItemId") {
      const product = productCardGames?.find((i) => i.id === data.productId);
      const productItem = product?.productItems?.find(
        (i) => i.id === data.productItemId
      );
      if (productItem) {
        setProductItem(productItem);
        router.replace({
          query: { ...router.query, itemId: productItem.id },
        });
      } else {
        setProductItem(undefined);
      }
    }
  });

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
      }),
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

  if (internalError && statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  return (
    <Container style={{ marginTop: 10 }}>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
          <StyledMainBox>
            <Typography variant="subtitle1">Ch???n game v?? g??i n???p</Typography>
            <form>
              <Controller
                name="productId"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      label="Game"
                      select={true}
                      onChange={onChange}
                      variant="filled"
                      size="small"
                      value={value}
                      error={error ? true : false}
                      helperText={error?.message}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {productCardGames?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                )}
              />

              <Controller
                name="productItemId"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      label="G??i n???p"
                      select={true}
                      onChange={onChange}
                      variant="filled"
                      size="small"
                      value={value || ""}
                      error={error ? true : false}
                      helperText={error?.message}
                    >
                      {/* {renderPackage(watchShowGame)} */}
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {productItemList?.length &&
                        productItemList.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </FormControl>
                )}
              />
            </form>
          </StyledMainBox>
          <StyledMainBox>
            <ProductDetail productItem={productItem}></ProductDetail>
          </StyledMainBox>
          <StyledMainBox>
            <Typography variant="h5" align="center" color="#008B88">
              H?????ng d???n N???P GENSHIN IMPACT
            </Typography>
            <Box p={2}>
              <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                ???? Gi?? n???p hi???n ???? ???n ?????nh c??c b???n n??n ????n ok nh??
              </Typography>
              <Typography
                style={{
                  color: "red",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
                component="h1"
              >
                B??I C??C C??U H???I V??? N???P:
              </Typography>

              <Typography
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Link check t??i kho???n ????ng hay ch??a
              </Typography>
              <Typography
                style={{
                  // backgroundColor: "red",
                  color: "yellow",
                  fontWeight: "bold",
                }}
              >
                https://account.mihoyo.com/#/account/loginDevices
              </Typography>
              <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                ????????n n???p khi n??n kh??ng th??? xong ???????c ngay c???n ?????i x??? l??
              </Typography>
              <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                ????N???u ????n h???y ti???n s??? ???????c ho??n v??? t??i kho???n c??c b???n
              </Typography>
              <Typography style={{}}>
                ????T??i kho???n v?? m???t kh???u n??n ????n ph???i l?? t??i kho???n Mihoyo ko l??n
                = FB - Google<br></br>
                ????UID l?? UID c??c b???n v???n d??ng k???t b???n<br></br>
                ????C??c g??i n???p ch??a t??nh x2 n???u c?? <br></br>
                ???? H??y cung c???p m?? ????ng nh???p khi shop li??n h??? l???y m?? login trong
                th?? maill <br></br>
                ???? N???u kh??ng c?? S??T h??y ??i???n link fb ho???c zalo ??? m???c ghi ch??
              </Typography>

              <Typography style={{ backgroundColor: "red", color: "yellow" }}>
                ???? M???t s??? l?? do khi ????n c???a b???n b??? h???y
              </Typography>
              <Typography>
                - Sai t??i kho???n ho???c m???t kh???u <br></br>- S??? ??i???n tho???i kh??ng
                li??n h??? ???????c <br></br>- Call nh??ng kh??ng nghe m??y <br></br>-
                Kh??ng n???p t??i kho???n Facebook
              </Typography>
              <Typography style={{}}>???? B???o h??nh n???p 100%</Typography>
              <Typography style={{}}>
                ???? M???i th??ng tin n???p n???u kh??ng hi???u h??y ib cho Fanpage
              </Typography>
              <Typography style={{ backgroundColor: "blue", color: "yellow" }}>
                ?????? L??u ?? : Khi n???p th??nh c??ng ????n h??y ?????i m???t kh???u ????? ?????m b???o an
                to??n!
              </Typography>
            </Box>
          </StyledMainBox>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <StyledMainBox>
            <Typography variant="h5" align="center" color="#008B88">
              Nh???p th??ng tin N???P
            </Typography>
            <form autoComplete="off">
              <Controller
                name="accountUserId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="User ID"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="accountName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="T??n t??i kho???n"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="accountPassword"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="M???t kh???u"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="accountServer"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="Server"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="accountCharacterName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="T??n nh??n v???t"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Typography variant="h6" align="left" color="#008B88">
                Th??ng tin li??n h???
              </Typography>
              <Controller
                name="contactName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="H??? T??n"
                      variant="filled"
                      size="small"
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
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="?????a ch??? email"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="contactPhoneNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="S??? ??i???n tho???i"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      {...field}
                      label="Ghi ch??"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />
              <FormControl
                error={!isEmpty(errors)}
                fullWidth
                variant="standard"
                size="small"
                sx={{ mt: 1 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    textAlign: "center",
                  }}
                  onClick={handleSubmit(onSubmit)}
                >
                  G???i y??u c???u
                </Button>
                <FormHelperText>
                  {!isEmpty(errors) ? "Th??ng tin kh??ng l???p l???!" : ""}
                </FormHelperText>
              </FormControl>
            </form>
          </StyledMainBox>
        </Grid>
      </Grid>
    </Container>
  );
};

CardGamePage.getLayout = (page: any) => (
  <MainLayout pageTitle="N???p games">{page}</MainLayout>
);
export default CardGamePage;
