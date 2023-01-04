import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function NotFoundData() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}>
      <Typography color="textPrimary" variant="h4">
        Không tìm thấy dữ liệu
      </Typography>
    </Box>
  );
}
