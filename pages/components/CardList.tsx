import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "./Card";
import { Product } from "../../interfaces/entity/product";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function BasicGrid({ products }: { products: Array<Product> }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h3"
        color={"#FFAD35"}
        // backgroundColor={"#1B3447"}
        mb={2}
        alignContent="center"
        align="center"
      >
        {products && products[0] ? products[0].name : ""}
      </Typography>
      <Grid container spacing={2}>
        {products &&
          products[0] &&
          products[0].productItems &&
          products[0].productItems.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                <Item style={{ padding: 0 }}>
                  <Card product={item} />
                </Item>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}
