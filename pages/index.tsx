import Link from "next/link";
import {
  CardMedia,
  CardActions,
  Box,
  Card,
  CardHeader,
  Button,
  Grid,
  Container
} from "@mui/material";
import MainLayout from "./components/MainLayout";

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
              height="450"
              width="auto"
              image="/static/images/banner1.1.jpg"
              alt=""
            />

            <CardHeader
              title="Mua bán tài khoản game uy tín"
              titleTypographyProps={{
                color: "red",
                fontSize: 28,
                textAlign: "center",
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
                  fontSize: 36,
                  textAlign: "center",
                }}
                subheader="với kho acc game cực kì hấp dẫn"
                subheaderTypographyProps={{
                  color: "red",
                  fontSize: 24,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                height="250"
                width="auto"
                image="/static/images/card-img1.1.jpg"
                alt=""
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <Link href={"/account-game"}>
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
                </Link>
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
                  fontSize: 36,
                  textAlign: "center",
                }}
                subheader="Chiết khấu cao - bảo hành trọn đời"
                subheaderTypographyProps={{
                  color: "red",
                  fontSize: 24,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              />
              <CardMedia
                component="img"
                height="250"
                width="auto"
                image="/static/images/card-img1.2.jpg"
                alt=""
              />

              <CardActions
                disableSpacing
                style={{
                  justifyContent: "center",
                }}
              >
                <Link href={"/card-game"}>
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
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: 4, marginBottom: 4 }}>
        {/* <Box
          style={{
            marginTop: 20,
            backgroundColor: "red",
          }}
        > */}
        <Container
          style={{
            backgroundColor: "#5CE1E6",
          }}
        ></Container>

        {/* </Box> */}
      </Container>
    </div>
  );
}

HomePage.getLayout = (page: any) => <MainLayout pageTitle='Trang chủ'>{page}</MainLayout>;

export default HomePage;
