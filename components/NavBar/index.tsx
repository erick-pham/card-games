import * as React from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setThemeModeState, selectThemeModeState } from "app/rootSlice";
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
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import { getSessionUserInfo } from "../../utils/get-session-user";

// const settings = ["Profile", "Orders", "Logout"];
// const settingsHrefs = ["/user/profile", "user/orders", "/"];

const StyledDarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const DarkModeSwitch = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeModeState);
  const onChangeDarkMode = (event: any, value: boolean) => {
    dispatch(setThemeModeState(value === true ? "dark" : "light"));
  };
  return (
    <StyledDarkModeSwitch
      value={themeMode === "light"}
      onChange={onChangeDarkMode}
      checked={themeMode === "dark"}
    />
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  textShadow: "0 0 10px #e8ff80, 0 0 20px #e8ff80, 0 0 40px #e8ff80",
  color: "#fff",
}));

const settings = ["Profile", "Logout"];
const settingsHrefs = ["profile", "/"];

const ResponsiveAppBar = () => {
  const { data: session } = useSession();
  const userInfo = getSessionUserInfo(session);

  let pages = ["Mua tài khoản game", "Nạp game"];
  let pageHrefs = ["/product-account-game", "/product-card-game"];

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
              alt="alt"
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
                <NextLink
                  href={"/"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <HomeIcon></HomeIcon>
                </NextLink>
              </MenuItem>
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <NextLink
                    href={pageHrefs[index]}
                    key={page}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
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
              alt="alt"
            ></NextImage>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <MenuItem onClick={handleCloseNavMenu}>
              <NextLink
                href={"/"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <HomeIcon fontSize="medium"></HomeIcon>
              </NextLink>
            </MenuItem>
            {pages.map((page, index) => (
              <NextLink
                href={pageHrefs[index]}
                key={page}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
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
          <Box sx={{ flexGrow: 0 }}>
            <DarkModeSwitch></DarkModeSwitch>
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
                    <NextLink
                      href={settingsHrefs[index]}
                      passHref={setting === "Logout"}
                      onClick={
                        setting === "Logout" ? () => signOut() : undefined
                      }
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {setting}
                    </NextLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <NextLink
                href={"/auth/signin"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
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
