import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { ClockIcon } from "../../icons";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import CardMedia from "@mui/material/CardMedia";
import { Product } from "database/entity/product";
import {
  GetLabelText,
  PRODUCT_STATUS_LABEL,
  StatusColor,
} from "common/constants";
export const ProductCard = ({
  product,
  handleClickEditProduct,
  ...rest
}: {
  product: Product;
  handleClickEditProduct: any;
}) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
    {...rest}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pb: 3,
        }}
      >
        <CardMedia
          component="img"
          height="150"
          image={product?.thumbnail}
          alt="alt"
        />
      </Box>
      <Typography align="center" color="textPrimary" gutterBottom variant="h5">
        {product?.name}
      </Typography>
      <Typography align="center" color="textPrimary" variant="body1">
        {product?.name}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <ClockIcon color="action" />
          <Typography
            color="textSecondary"
            display="inline"
            sx={{ pl: 1 }}
            variant="body2"
          >
            Updated{" "}
            {new Date(product?.createdAt || new Date()).toLocaleString()}
          </Typography>
        </Grid>

        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Chip
            label={GetLabelText(PRODUCT_STATUS_LABEL, product?.status)}
            color={StatusColor(product?.status)}
          />
        </Grid>

        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={() => handleClickEditProduct(product.id)}
          >
            <EditIcon color="action" />
          </IconButton>
          {/* <Typography
            color="textSecondary"
            display="inline"
            sx={{ pl: 1 }}
            variant="body2"
          >
            {product.totalDownloads} Downloads
          </Typography> */}
        </Grid>
      </Grid>
    </Box>
  </Card>
);

export default ProductCard;
