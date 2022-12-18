import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { OrderEntity } from "database/entity/order";
import UnitOfWork from "database/unit-of-work";
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Card,
  CardHeader,
} from "@mui/material";
import numeral from "numeral";
import { format } from "date-fns";
type OrderResultPageProps = {
  internalError?: boolean;
  statusCode?: number;
  orderData?: OrderEntity;
};
import NavBar from "./components/NavBar";
import styles from "../styles/Home.module.css";
const OrderResultPage: NextPage = ({ orderData }: OrderResultPageProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Trạng thái đơn hàng</title>
      </Head>
      <NavBar></NavBar>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          alignItems: "center",
          // textAlign: "center",
          minHeight: "100vh",
        }}
      >
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
            title={orderData ? "Đặt hàng thành công" : "Không tìm thấy đơn hàng"}
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
                  Thông tin liên hệ
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Họ Tên: {orderData?.contactName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Số điện thoại: {orderData?.contactPhoneNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Email: {orderData?.contactEmail}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Mã đơn: {orderData?.referenceNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ngày tạo:{" "}
                  {orderData ? format(new Date(orderData?.createdAt), "Pp") : ""}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Trạng thái: {orderData?.status}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography gutterBottom variant="h5" component="div">
                  Đơn hàng:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Loại: {orderData?.productItem.type}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tên sản phẩm: {orderData?.productItem.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Đặc điểm: {orderData?.productItem.description}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{ fontWeight: "bold" }}
                >
                  Giá: {orderData ? `${numeral(orderData?.productItem?.price).format("0,0")} ${orderData?.productItem?.currency}` : ''}
                </Typography>
              </Grid>

            </Grid>

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
      </Box >
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  try {
    const { params, req, res, query } = context;
    let orderData = null;

    if (query.referenceNumber) {
      const uow = new UnitOfWork();
      await uow.initialize();
      const data = await uow.OrderRepository.findOne({
        where: {
          referenceNumber: query?.referenceNumber as string || ''
        },
        relations: {
          productItem: true,
        },
      });
      // const data = await uow.OrderRepository.findOneBy({
      //   referenceNumber: query?.referenceNumber as string || ''
      // });

      const orderData = JSON.parse(JSON.stringify(data));
      return {
        props: { orderData },
      };
    } else {
      return {
        props: { orderData },
      };
    }
  } catch (error) {
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

export default OrderResultPage;