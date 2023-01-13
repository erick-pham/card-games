import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import numeral from "numeral";

export const TotalCustomers = (props: any) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TOTAL CUSTOMERS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {props?.totalCustomer || 0}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <PeopleIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          pt: 2,
        }}
      >
        {props.totalCustomerGrowthRate && props.totalCustomerGrowthRate > 0 ? (
          <>
            <ArrowUpwardIcon color="success" />
            <Typography
              variant="body2"
              sx={{
                mr: 1,
              }}
            >
              {numeral(props.totalCustomerGrowthRate).format("0.%")}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              Since last month
            </Typography>
          </>
        ) : (
          <>
            <ArrowDownwardIcon color="error" />
            <Typography
              variant="body2"
              color="error"
              sx={{
                mr: 1,
              }}
            >
              {numeral(props.totalCustomerGrowthRate).format("0.%")}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              Since last month
            </Typography>
          </>
        )}
      </Box>
    </CardContent>
  </Card>
);
