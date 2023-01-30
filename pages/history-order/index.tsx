import { GetServerSideProps } from "next";
import OrderEntity from "database/entity/order";
import UnitOfWork from "database/unit-of-work";
import {
  Box,
  Grid,
  Typography,
  Link,
  Container,
  Divider,
  CardMedia,
} from "@mui/material";
import numeral from "numeral";
import { format } from "date-fns";
import MainLayout from "components/MainLayout";
import NextLinkComposed from "components/NextLinkComposed";
import { StyledMainBox } from "components/CustomStyledBox";

import {
  PRODUCT_ITEM_TYPES_LABEL,
  GetLabelText,
  ORDER_STATUS_LABEL,
} from "common/constants";

type HistoryOrderPageProps = {
  internalError?: boolean;
  statusCode?: number;
  orderData?: OrderEntity;
};

const HistoryOrderPage = ({ orderData }: HistoryOrderPageProps) => {
  return (
    <Container style={{ marginTop: 10 }}>
      <Box>
        <StyledMainBox>
          <Typography
            sx={{
              color: "green",
              fontSize: 28,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {orderData ? "Đặt hàng thành công" : "Không tìm thấy đơn hàng"}
          </Typography>
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
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Typography gutterBottom variant="h5" component="div">
                Đơn hàng
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                style={{ fontWeight: "bold" }}
              >
                Mã đơn: {orderData?.referenceNumber}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                style={{ fontWeight: "bold" }}
              >
                Tổng:{" "}
                {orderData
                  ? `${numeral(orderData?.amount).format("0,0")} ${
                      orderData?.productItem?.currency
                    }`
                  : ""}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Loại:{" "}
                {GetLabelText(
                  PRODUCT_ITEM_TYPES_LABEL,
                  String(orderData?.productItem.type)
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tên sản phẩm: {orderData?.productItem.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Đặc điểm: {orderData?.productItem.description}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Chi tiết sản phẩm:{" "}
                {orderData?.productItem.type === "CARD_GAME" && (
                  <Link
                    href={`product-card-game?game=${orderData?.productItem.productId}&itemId=${orderData?.productItem.id}`}
                  >
                    Click vào đây
                  </Link>
                )}
                {orderData?.productItem.type === "ACCOUNT_GAME" && (
                  <Link
                    href={`product-account-game/${orderData?.productItem.id}/details`}
                  >
                    Click vào đây
                  </Link>
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ngày tạo:{" "}
                {orderData ? format(new Date(orderData?.createdAt), "Pp") : ""}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Trạng thái:{" "}
                {GetLabelText(ORDER_STATUS_LABEL, String(orderData?.status))}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            variant="h6"
            color="info.main"
            sx={{ fontStyle: "italic", mt: 4 }}
          >
            Sau khi đặt hàng thành công, các bạn nên chuyển khoản cho chủ shop
            càng sớm để giữ đơn. Nội chung chuyển khoản bao gồm SĐT và mã hơn
            hàng ở trên.
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            color="error.main"
            sx={{ fontStyle: "italic", mt: 4 }}
          >
            Vui lòng liên hệ{" "}
            <NextLinkComposed href="https://www.facebook.com/shopaccgi">
              fanpage{" "}
            </NextLinkComposed>
            hoặc gọi{" "}
            <NextLinkComposed href="tel:0339839409">
              033 983 9409
            </NextLinkComposed>{" "}
            ngay sau khi chuyển khoản để giao nhận tài khoản. Xin Cảm ơn!
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            color="info.main"
            sx={{ fontStyle: "italic" }}
          >
            Thanh toán bằng card điện thoại thì liên hệ fanpage để gạch thẻ. Phí
            gạch thẻ 100k card = 80k ATM
          </Typography>
          <Typography
            variant="h6"
            color="info.main"
            sx={{ fontStyle: "italic" }}
          >
            Chủ tài khoản: Nguyễn Ngọc Lâm
          </Typography>
          <Typography
            variant="h6"
            color="info.main"
            sx={{ fontStyle: "italic" }}
          >
            Vietcombank: 0441000684540
          </Typography>
          <Typography
            variant="h6"
            color="info.main"
            sx={{ fontStyle: "italic" }}
          >
            Momo: 0339839409
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="info.main"
            sx={{ fontStyle: "italic" }}
          >
            Quét mã QR để thanh toán
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <CardMedia
                component={"img"}
                src={"/static/images/payment/qr-code-vietcombank.jpg"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <CardMedia
                component={"img"}
                src={"/static/images/payment/qr-code-momo.jpg"}
              />
            </Grid>
          </Grid>

          <Divider
            sx={{
              borderColor: "#2D3748",
              my: 3,
            }}
          />
        </StyledMainBox>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { params, req, res, query } = context;
    let orderData = null;
    // Add whatever `Cache-Control` value you want here
    context.res.setHeader("Cache-Control", "no-cache");
    if (query.referenceNumber) {
      const uow = new UnitOfWork();
      await uow.initialize();
      const data = await uow.OrderRepository.findOne({
        where: {
          referenceNumber: (query?.referenceNumber as string) || "",
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

HistoryOrderPage.getLayout = (page: any) => (
  <MainLayout pageTitle="Lịch sử đơn hàng">{page}</MainLayout>
);
export default HistoryOrderPage;
