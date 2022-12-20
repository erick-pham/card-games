import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Container,
  CardContent,
  Button,
  CardMedia,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  setDialogImageState,
} from "app/rootSlice";
import { ProductItem } from "database/entity/product_item";
import UnitOfWork from "database/unit-of-work";
import { PRODUCT_ITEM_STATUS } from "common/constants";
import DialogImage from "pages/components/DialogImage";
import NotFoundData from "pages/components/NotFoundData";
import MainLayout from "pages/components/MainLayout";

const AccountGameDetailPage = ({ productItem }: { productItem: ProductItem }) => {
  const dispatch = useDispatch();

  const handleClickImage = () => {
    dispatch(setDialogImageState({ open: true, url: productItem?.thumbnail }));
  };

  if (!productItem) {
    return <NotFoundData></NotFoundData>;
  }

  return (
    <>
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
              title={"Thông tin và đặc điểm tài khoản"}
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
                  <br></br>
                  {productItem.status === PRODUCT_ITEM_STATUS.SOLD ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="inherit"
                      style={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        bottom: 0,
                        borderRadius: "0px",
                      }}
                      disabled={true}
                    >
                      Đã bán
                    </Button>) : (
                    <NextLink href={`/account-game/${productItem.id}/checkout`}>
                      <Button
                        variant="contained"
                        size="small"
                        color="inherit"
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          bottom: 0,
                          borderRadius: "0px",
                        }}
                      >
                        Mua Ngay
                      </Button>
                    </NextLink>)}
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
    </>
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
          id: query?.productItemId as string || ''
        }
      });

      productItemData = JSON.parse(JSON.stringify(data));
    }
    return {
      props: { productItem: productItemData },
    };
  } catch (error) {
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

AccountGameDetailPage.getLayout = (page: any) => <MainLayout pageTitle='Chi tiết tài khoản'>{page}</MainLayout>;
export default AccountGameDetailPage;
