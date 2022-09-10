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
        backgroundColor: "#1B3447",
      }}
    >
      <CardMedia
        component="img"
        height="150"
        image={product.thumbnail}
        alt="Paella dish"
      />

      <CardHeader
        title={product.name}
        titleTypographyProps={{ color: "#FFAD35" }}
        subheader={
          numeral(product.price).format("0,0") + " " + product.currency
        }
        subheaderTypographyProps={{ color: "#B6B6B6" }}
      />

      {/* <CardContent
        style={{
          padding: 8,
        }}
      >
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
      </CardContent> */}
      <CardActions disableSpacing>
        <Link href={`/user/pre-order/${product.id}`}>
          <Button
            variant="contained"
            style={{
              width: "100%",
              color: "black",
              backgroundColor: "#FFC107",
              fontWeight: "bold",
            }}
            startIcon={<SellIcon />}
          >
            Mua ngay
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
