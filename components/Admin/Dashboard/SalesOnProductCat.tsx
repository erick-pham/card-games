import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  // useTheme,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import numeral from "numeral";
export const SalesOnProductCat = (props: any) => {
  // const theme = useTheme();
  const { totalOrderOnAccountGame = 0, totalOrderOnCardGame = 0 } = props;

  const data = {
    datasets: [
      {
        label: " of orders",
        data: [totalOrderOnAccountGame, totalOrderOnCardGame],
        backgroundColor: ["#3F51B5", "#e53935"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: ["Account game", "Card"],
  };

  // const options = {
  //   animation: false,
  //   cutoutPercentage: 80,
  //   layout: { padding: 0 },
  //   legend: {
  //     display: false,
  //   },
  //   maintainAspectRatio: false,
  //   responsive: true,
  //   tooltips: {
  //     backgroundColor: theme.palette.background.paper,
  //     bodyFontColor: theme.palette.text.secondary,
  //     borderColor: theme.palette.divider,
  //     borderWidth: 1,
  //     enabled: true,
  //     footerFontColor: theme.palette.text.secondary,
  //     intersect: false,
  //     mode: "index",
  //     titleFontColor: theme.palette.text.primary,
  //   },
  // };

  const productCats = [
    {
      title: "Account game",
      value: numeral(
        totalOrderOnAccountGame /
          (totalOrderOnAccountGame + totalOrderOnCardGame || 1)
      ).format("%"),
      icon: AccountBoxIcon,
      color: "#3F51B5",
    },
    {
      title: "Card",
      value: numeral(
        totalOrderOnCardGame /
          (totalOrderOnAccountGame + totalOrderOnCardGame || 1)
      ).format("%"),
      icon: CreditCardIcon,
      color: "#E53935",
    },
  ];

  return (
    <Card {...props}>
      <CardHeader title="Sales by Product Cat" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Doughnut data={data} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {productCats.map(({ color, icon: Icon, title, value }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Icon color="action" />
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h4">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
