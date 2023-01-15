import {
  Typography,
  Stack,
  Divider,
  Chip,
  CardMedia,
  Box,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import SellIcon from "@mui/icons-material/Sell";
import numeral from "numeral";
import {
  PRODUCT_ITEM_STATUS,
  PRODUCT_ITEM_STATUS_TEXT_VI,
} from "@common/constants";
import NextLinkComposed from "components/NextLinkComposed";

const ProductDetail = ({
  productItem,
}: {
  productItem: ProductItemType | undefined;
}) => {
  const isItemSold = productItem?.status === PRODUCT_ITEM_STATUS.SOLD;
  return (
    <>
      <Typography variant="h5" fontWeight={800}>
        {productItem?.name}
      </Typography>
      <Typography variant="caption">
        {`#${productItem?.referenceNumber || ""}`}
      </Typography>
      <Box mt={2} mb={2}>
        <Divider></Divider>
      </Box>
      <Stack direction="row" alignItems="center" gap={1}>
        <SellIcon />
        {productItem && (
          <Chip
            label={
              productItem?.status
                ? PRODUCT_ITEM_STATUS_TEXT_VI[productItem.status]
                : ""
            }
            color={isItemSold ? "warning" : "primary"}
          />
        )}
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        <PriceCheckIcon />
        {productItem?.isSale && productItem?.salePrice ? (
          <>
            <Typography
              variant="h6"
              color={"text.primaryRed"}
              style={{ fontWeight: 800 }}
            >
              {numeral(productItem?.salePrice).format("0,0[.]00đ") +
                " " +
                productItem?.currency}
            </Typography>
            <Typography variant="h6" color={"text.primaryRed"}>
              {numeral(
                (productItem?.salePrice - productItem?.price) /
                  productItem?.price
              ).format("%")}
            </Typography>
            <Typography
              variant="h6"
              color={"text.primary"}
              style={{ textDecoration: "line-through", fontStyle: "normal" }}
            >
              {numeral(productItem?.price).format("0,0[.]00đ") +
                " " +
                productItem?.currency}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" color="text.primaryRed" fontWeight={800}>
            {`${numeral(productItem?.price).format("0,0")} ${
              productItem?.currency || ""
            }`}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        <AssignmentIcon />
        <Typography variant="subtitle1" color="text.primary">
          Đặc điểm
        </Typography>
      </Stack>
      <Typography variant="body1" color="text.primary">
        {productItem?.description}
      </Typography>
      <NextLinkComposed
        href={productItem?.thumbnail || "#"}
        rel="noopener noreferrer"
        target="_blank"
      >
        {productItem?.thumbnail && (
          <CardMedia
            component="img"
            image={productItem?.thumbnail}
            alt="alt"
          ></CardMedia>
        )}
      </NextLinkComposed>
      <div
        dangerouslySetInnerHTML={{ __html: productItem?.longDescription || "" }}
      />
    </>
  );
};

export type ProductItemType = {
  id: string;
  name: string;
  referenceNumber: string;
  price: number | 0;
  isSale?: boolean;
  salePrice?: number;
  salePriceEndDate?: Date;
  currency: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  status: string;
};

export default ProductDetail;
