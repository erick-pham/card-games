import {
  Avatar,
  Box,
  // Button,
  Card,
  // CardActions,
  CardContent,
  // Divider,
  Typography,
} from "@mui/material";

import { useSession } from "next-auth/react";

export const AccountProfile = (props: any) => {
  const { data: session } = useSession();
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={session?.user?.image || ""}
            sx={{
              height: 64,
              mb: 2,
              width: 64,
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h5">
            {session?.user?.name || ""}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Vietnam
          </Typography>
          <Typography color="textSecondary" variant="body2">
            VN +7
          </Typography>
        </Box>
      </CardContent>
      {/* <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default AccountProfile;
