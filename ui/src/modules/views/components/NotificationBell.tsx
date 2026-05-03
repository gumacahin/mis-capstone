import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  type AppNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@shared/hooks/queries";
import { MouseEvent, useState } from "react";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.is_read) {
      markRead(notification.id);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="default"
        onClick={handleOpen}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1.5}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={() => markAllRead()}>
              Mark all read
            </Button>
          )}
        </Stack>
        <Divider />
        {notifications.length === 0 ? (
          <Box px={2} py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding dense>
            {notifications.map((n) => (
              <ListItem key={n.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    bgcolor: n.is_read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="span"
                      >
                        {n.message ? `${n.message} · ` : ""}
                        {timeAgo(n.created_at)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
