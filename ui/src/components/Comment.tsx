import { useState } from "react";
import { Comment as CommentType } from "../types/common";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Comment({
  comment,
  handleDelete,
}: {
  comment: CommentType;
  handleDelete: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ListItem key={comment.id}>
      <ListItemIcon>
        <Avatar {...stringAvatar(comment.author_name || "Todo User")} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography fontWeight={600}>{comment.author_name}</Typography>
        }
        secondary={<Typography>{comment.body}</Typography>}
      />
      <ListItemSecondaryAction>
        <IconButton
          id="comment-options-button"
          aria-label="comment-options"
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="comment-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "comment-options-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete();
              handleClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}
