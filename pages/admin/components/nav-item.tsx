import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Button, ListItem } from "@mui/material";
import { signOut } from "next-auth/react";

const MyStyledButton = (props: any) => {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: props.active && "rgba(255,255,255, 0.08)",
        borderRadius: 1,
        color: props.active ? "secondary.main" : "neutral.300",
        fontWeight: props.active && "fontWeightBold",
        justifyContent: "flex-start",
        px: 3,
        textAlign: "left",
        textTransform: "none",
        width: "100%",
        "& .MuiButton-startIcon": {
          color: props.active ? "secondary.main" : "neutral.400",
        },
        "&:hover": {
          backgroundColor: "rgba(255,255,255, 0.08)",
        },
      }}
    >
      {props.children}
    </Button>
  );
};

export const NavItem = (props: any) => {
  const { href, icon, title, ...others } = props;
  const router = useRouter();
  const active = href ? router.pathname === href : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        mb: 0.5,
        py: 0,
        px: 2,
      }}
      {...others}
    >
      <NextLink
        href={href || "/"}
        passHref
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <MyStyledButton
          // component="a"
          startIcon={icon}
          disableRipple
          active={active === true ? "true" : undefined}
          onClick={title === "SignOut" ? () => signOut() : null}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </MyStyledButton>
      </NextLink>
    </ListItem>
  );
};

export default NavItem;
