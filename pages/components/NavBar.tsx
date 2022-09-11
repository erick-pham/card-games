import * as React from "react";
import NextLink from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { signOut, useSession } from "next-auth/react";
import { getSessionUserInfo } from "../../utils/get-session-user";

// const settings = ["Profile", "Orders", "Logout"];
// const settingsHrefs = ["/user/profile", "user/orders", "/"];
const settings = ["Logout"];
const settingsHrefs = ["/"];

const ResponsiveAppBar = () => {
  const { data: session } = useSession();
  const userInfo = getSessionUserInfo(session);

  let pages = ["Trang chủ", "Mua tài khoản game", "Nạp game"];
  let pageHrefs = ["/", "/account-game", "/nap-game"];

  if (userInfo?.isAdmin) {
    pages.push("Admin");
    pageHrefs.push("/admin");
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false} style={{ backgroundColor: "#1B3447" }}>
        <Toolbar disableGutters style={{ backgroundColor: "#1B3447" }}>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <NextLink href={pageHrefs[index]} key={page}>
                    <Typography textAlign="center">{page}</Typography>
                  </NextLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <NextLink href={pageHrefs[index]} key={page}>
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              </NextLink>
            ))}
          </Box>

          {userInfo ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="alt" src={userInfo?.image || ""} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <NextLink href={settingsHrefs[index]} passHref>
                      <Button
                        component="a"
                        onClick={
                          setting === "Logout" ? () => signOut() : undefined
                        }
                      >
                        {setting}
                      </Button>
                    </NextLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <NextLink href={"/auth/signin"}>Đăng nhập</NextLink>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
