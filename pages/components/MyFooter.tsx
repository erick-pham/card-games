import { Container, Grid, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import styles from "../../styles/Home.module.css";

export const MyFooter = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                color: "white",
              }}
            >
              <LockIcon sx={{ fontSize: 40 }} /> Secure Transactions
            </Typography>
            <Typography color={"white"}>
              Feel confident each time you transact with us. GamerProtect comes
              with SSL protection and wide range of payment processors under a
              safe and secured platform.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                color: "white",
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 40 }} /> Customer Support
            </Typography>
            <Typography color={"white"}>
              Our dedicated Customer Service team are available to help with any
              queries about your orders and provide exceptional after-sales
              support.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                color: "white",
              }}
            >
              <MonetizationOnIcon sx={{ fontSize: 36 }} />
              Best Offers
            </Typography>
            <Typography color={"white"}>
              G2G provides competitive pricing to the buyers driven by a free
              market economy while striving to keep the cost low for our
              sellers.
            </Typography>
          </Grid>
        </Grid>
        <Grid mt={4}>
          <Typography
            variant="h6"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            GI7.COM
          </Typography>
        </Grid>
        <Grid>
          <Typography
            variant="h6"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            <PhoneIcon sx={{ fontSize: 18, marginRight: 1 }} />
            HOTLINE: 033 9839 409
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
};
export default MyFooter;
