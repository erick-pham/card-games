import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { SearchIcon } from "./Icons";

export const OrderListToolbar = ({
  handleSearch,
  placeholderSearch,
  headTitle,
  ...rest
}: {
  handleSearch: any;
  placeholderSearch: string;
  headTitle: string;
}) => (
  <Box {...rest}>
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      <Typography sx={{ m: 1 }} variant="h4">
        {headTitle}
      </Typography>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder={placeholderSearch}
              variant="outlined"
              onKeyPress={handleSearch}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default OrderListToolbar;
