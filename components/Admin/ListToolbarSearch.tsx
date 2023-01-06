import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Button,
} from "@mui/material";
import { SearchIcon } from "./Icons";

export const ListToolbarSearch = ({
  handleSearch,
  placeholderSearch,
  headTitle,
  rightComponent,
  primaryComponent,
  ...rest
}: {
  handleSearch: any;
  placeholderSearch: string;
  headTitle?: string;
  rightComponent?: any;
  primaryComponent?: any;
}) => (
  <Box>
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
      {rightComponent && <Box sx={{ m: 1 }}>{rightComponent}</Box>}
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          {primaryComponent && <Box>{primaryComponent}</Box>}
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

export default ListToolbarSearch;
