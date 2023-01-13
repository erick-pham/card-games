import NextLinkComposed from "components/NextLinkComposed";
import {
  CardMedia,
  CardActions,
  Box,
  Card,
  CardHeader,
  Button,
  Grid,
  Container,
} from "@mui/material";
import MainLayout from "components/MainLayout";

const HomePage = () => {
  return (
    <div>
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 8 }}>
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
              width="auto"
              image="/static/images/banner1.1.jpg"
              alt=""
              sx={{
                maxHeight: "450px",
              }}
            />

            <CardHeader
              title="Mua bán tài khoản game uy tín"
              titleTypographyProps={{
                color: "red",
                textAlign: "center",
                // sx: {
                //   textShadow:
                //     "0 0 10px #D50A1F, 0 0 20px #D50A1F, 0 0 40px #D50A1F",
                // },
              }}
              subheaderTypographyProps={{ color: "#B6B6B6" }}
            />
          </Card>
        </Box>
      </Container>
      <Container style={{ marginTop: 4, marginBottom: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card
              variant="outlined"
              style={{
                padding: 0,
                border: "none",
                boxShadow: "none",
                backgroundColor: "#1B3447",
              }}
            >
              <CardHeader
                title="Mua Acc game"
                titleTypographyProps={{
                  color: "red",
                  textAlign: "center",
                }}
                subheader="với kho acc game cực kì hấp dẫn"
                subheaderTypographyProps={{
                  color: "red",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                width="auto"
                image="/static/images/card-img1.1.jpg"
                alt=""
                sx={{
                  maxHeight: "250px",
                }}
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <NextLinkComposed
                  href={"/product-account-game"}
                  sx={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: "auto",
                      color: "black",
                      backgroundColor: "#FFC107",
                      fontWeight: "bold",
                    }}
                  >
                    MUA NGAY
                  </Button>
                </NextLinkComposed>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card
              variant="outlined"
              style={{
                padding: 0,
                border: "none",
                boxShadow: "none",
                backgroundColor: "#1B3447",
              }}
            >
              <CardHeader
                title="Nạp game"
                titleTypographyProps={{
                  color: "red",
                  textAlign: "center",
                }}
                subheader="Chiết khấu cao - bảo hành trọn đời"
                subheaderTypographyProps={{
                  color: "red",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                width="auto"
                image="/static/images/card-img1.2.jpg"
                alt=""
                sx={{
                  maxHeight: "250px",
                }}
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <NextLinkComposed
                  href={"/product-card-game"}
                  sx={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: "auto",
                      color: "black",
                      backgroundColor: "#FFC107",
                      fontWeight: "bold",
                    }}
                  >
                    NẠP NGAY
                  </Button>
                </NextLinkComposed>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

HomePage.getLayout = (page: any) => (
  <MainLayout pageTitle="Trang chủ">{page}</MainLayout>
);

export default HomePage;
