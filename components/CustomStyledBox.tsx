import { styled, Box } from "@mui/material";
export const StyledMainBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 4,
  padding: 18,
  marginTop: 4,
  marginBottom: 4,
  // backgroundColor: "rgba(0, 0, 0, 0.40)",
}));

export default StyledMainBox;
