import { useAuth0 } from "@auth0/auth0-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { type MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useAuth0();
  const navigate = useNavigate();
  // const handleClick = (event: MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleLogoutClick = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleSettingsClick = () => {
    navigate("settings");
  };

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
  };

  const name = "Todo User";
  const initial = name[0].toLocaleUpperCase();

  return (
    <>
      <Tooltip title="Account menu">
        <Button
          onClick={handleMenuClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="text"
          startIcon={<Avatar sx={{ width: 24, height: 24 }}>{initial}</Avatar>}
          endIcon={<ExpandMoreIcon />}
        >
          {name}
        </Button>
      </Tooltip>
      <Menu
        sx={{ width: 320 }}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileClick} disabled>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          {name}
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
