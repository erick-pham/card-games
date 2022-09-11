import * as React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SellIcon from "@mui/icons-material/Sell";
import numeral from "numeral";
import { ProductItem } from "../../interfaces/entity/product_item";
import { Box, CardContent, Grid, Typography } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
export default function RecipeReviewCard({
  product,
}: {
  product: ProductItem;
}) {
  if (!product) return <></>;
  return (
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
          <CardMedia
            component="img"
            height="200"
            width="auto"
            image={product.thumbnail}
            alt="alt"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Box height={150}>
            <Typography
              variant="body2"
              color="#B6B6B6"
              alignContent="left"
              align="left"
              style={{
                padding: 8,
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
                {numeral(product.price).format("0,0") + " " + product.currency}
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
                  Chi tiết
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
