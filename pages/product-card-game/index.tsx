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
            <Typography variant="subtitle1">Chọn game và gói nạp</Typography>
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
                      label="Gói nạp"
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
              Hướng dẫn NẠP GENSHIN IMPACT
            </Typography>
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
                  // backgroundColor: "red",
                  color: "yellow",
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
                📛Tài khoản và mật khẩu nên đơn phải là tài khoản Mihoyo ko lên
                = FB - Google<br></br>
                📛UID là UID các bạn vẫn dùng kết bạn<br></br>
                📛Các gói nạp chưa tính x2 nếu có <br></br>
                📛 Hãy cung cấp mã đăng nhập khi shop liên hệ lấy mã login trong
                thư maill <br></br>
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
              <Typography style={{ backgroundColor: "blue", color: "yellow" }}>
                ❇️ Lưu ý : Khi nạp thành công đơn hãy đổi mật khẩu để đảm bảo an
                toàn!
              </Typography>
            </Box>
          </StyledMainBox>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <StyledMainBox>
            <Typography variant="h5" align="center" color="#008B88">
              Nhập thông tin NẠP
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
                      label="Tên tài khoản"
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
                      label="Mật khẩu"
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
                      label="Tên nhân vật"
                      variant="filled"
                      size="small"
                      error={error ? true : false}
                      helperText={error?.message}
                    />
                  </FormControl>
                )}
              />

              <Typography variant="h6" align="left" color="#008B88">
                Thông tin liên hệ
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
                      label="Họ Tên"
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
                      label="Địa chỉ email"
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
                      label="Số điện thoại"
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
                      label="Ghi chú"
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
                  Gửi yêu cầu
                </Button>
                <FormHelperText>
                  {!isEmpty(errors) ? "Thông tin không lợp lệ!" : ""}
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
  <MainLayout pageTitle="Nạp games">{page}</MainLayout>
);
export default CardGamePage;
