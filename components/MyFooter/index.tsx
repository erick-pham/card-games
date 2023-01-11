import { Container, Grid, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import Copyright from "components/Copyright";

export const MyFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        // backgroundColor: (theme) =>
        //   theme.palette.mode === "light"
        //     ? theme.palette.grey[200]
        //     : theme.palette.grey[800],

        flexShrink: 0,
        backgroundColor: "rgba(0, 0, 0, 0.40)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
              <LockIcon sx={{ fontSize: 40 }} />
              Bảo mật
            </Typography>
            <Typography color={"white"}>
              Cảm thấy tự tin mỗi khi bạn giao dịch với chúng tôi.
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
              <SupportAgentIcon sx={{ fontSize: 40 }} />
              Hỗ trợ khách hàng
            </Typography>
            <Typography color={"white"}>
              Đội ngũ hỗ trợ Khách hàng tận tâm của chúng tôi luôn sẵn sàng trợ
              giúp mọi thắc mắc về đơn đặt hàng của bạn và cung cấp hỗ trợ sau
              bán hàng.
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
              Giá tốt nhất
            </Typography>
            <Typography color={"white"}>
              Gameshop247 cung cấp giá cả tốt nhất cho người mua.
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
            gameshop247.com
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
        <Grid m={0}>
          <Copyright></Copyright>
        </Grid>
      </Container>
    </Box>
  );
};
export default MyFooter;
