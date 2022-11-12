import * as React from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import { getSessionUserInfo } from "../../utils/get-session-user";

// const settings = ["Profile", "Orders", "Logout"];
// const settingsHrefs = ["/user/profile", "user/orders", "/"];

const StyledButton = styled(Button)(({ theme }) => ({
  textShadow: "0 0 10px #e8ff80, 0 0 20px #e8ff80, 0 0 40px #e8ff80",
  color: "#fff",
}));

const settings = ["Logout"];
const settingsHrefs = ["/"];

const ResponsiveAppBar = () => {
  const { data: session } = useSession();
  const userInfo = getSessionUserInfo(session);

  let pages = ["Mua tài khoản game", "Nạp game"];
  let pageHrefs = ["/account-game", "/card-game"];

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
    <AppBar
      position="sticky"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.40)" }}
    >
      <Container
      // maxWidth={false}
      // style={{ backgroundColor: "rgba(255, 146, 136, 0.08)" }}
      >
        <Toolbar disableGutters>
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
            <NextImage
              src="/static/images/logo.png"
              height={40}
              width={80}
            ></NextImage>
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
              <MenuItem onClick={handleCloseNavMenu}>
                <NextLink href={"/"}>
                  <HomeIcon></HomeIcon>
                </NextLink>
              </MenuItem>
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <NextLink href={pageHrefs[index]} key={page}>
                    <Typography textAlign="center">{page}</Typography>
                  </NextLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
            <NextImage
              src="/static/images/logo.png"
              height={40}
              width={80}
            ></NextImage>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <MenuItem onClick={handleCloseNavMenu}>
              <NextLink href={"/"}>
                <HomeIcon fontSize="medium"></HomeIcon>
              </NextLink>
            </MenuItem>
            {pages.map((page, index) => (
              <NextLink href={pageHrefs[index]} key={page}>
                <StyledButton
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontSize: 16,
                  }}
                >
                  {page}
                </StyledButton>
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
              <NextLink href={"/auth/signin"}>
                <StyledButton>Đăng nhập</StyledButton>
              </NextLink>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
