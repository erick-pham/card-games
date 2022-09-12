import Link from "next/link";
import numeral from "numeral";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardMedia,
  Button,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import DialogImage from "./DialogImage";
import { setDialogImageState } from "../../app/rootSlice";
import { ProductItem } from "../../interfaces/entity/product_item";

export default function RecipeReviewCard({
  product,
}: {
  product: ProductItem;
}) {
  const dispatch = useDispatch();
  const handleClickImage = () => {
    dispatch(setDialogImageState({ open: true, url: product.thumbnail }));
  };

  if (!product) return <></>;
  return (
    <>
      <DialogImage></DialogImage>
      <Card
        variant="outlined"
        style={{
          padding: 0,
          border: "none",
          boxShadow: "none",
          // backgroundColor: "#1B3447",
          minHeight: 200,
          height: "auto",
          borderRadius: "0",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Tooltip title="click để xem ảnh lớn hơn" placement="top">
              <CardMedia
                component="img"
                height="200"
                width="auto"
                image={product.thumbnail}
                alt="alt"
                onClick={handleClickImage}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box height={150}>
              <Typography
                variant="h6"
                color="#B6B6B6"
                alignContent="left"
                align="left"
                style={{
                  padding: 4,
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="#B6B6B6"
                alignContent="left"
                align="left"
                style={{
                  padding: 4,
                }}
              >
                {product.description}
              </Typography>
            </Box>

            <Grid container>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography
                  variant="h6"
                  alignContent="left"
                  align="left"
                  style={{
                    padding: 8,
                  }}
                >
                  {numeral(product.price).format("0,0") +
                    " " +
                    product.currency}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Link href={`/user/pre-order/${product.id}`}>
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
                    Mua ngay
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
