import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, MouseEvent, useState } from "react";
import { toast } from "react-hot-toast";

import { useUpdateComment } from "../api";
import type { IComment } from "../types/common";

export default function Comment({
  comment,
  handleDelete,
  handleEdit,
  handleCloseEdit,
  isEditing,
  userId,
}: {
  comment: IComment;
  handleDelete: () => void;
  handleEdit: () => void;
  handleCloseEdit: () => void;
  isEditing: boolean;
  userId: number;
}) {
  const [isLoading, setLoading] = useState(false);
  const updateComment = useUpdateComment(comment);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editedComment, setEditedComment] = useState(comment.body);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const updatedComment = Object.fromEntries(
      formData.entries(),
    ) as unknown as IComment;
    toast.promise(
      updateComment.mutateAsync(updatedComment, {
        onSettled: () => {
          setLoading(false);
        },
      }),
      {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Error updating task.",
      },
    );
    handleCloseEdit();
  };

  if (isEditing) {
    return (
      <Stack my={3} spacing={1} component={"form"} onSubmit={handleSubmit}>
        <TextField
          id="comment"
          label="Comment"
          name="body"
          multiline
          fullWidth
          value={editedComment}
          onChange={(e) => {
            setEditedComment(e.target.value);
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
          <Button onClick={handleCloseEdit} variant="text">
            Cancel
          </Button>
          <Button disabled={isLoading} variant="contained" type="submit">
            Update Comment
          </Button>
        </Stack>
      </Stack>
    );
  }
  const commentBelongsToUser = comment.author_id === userId;
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
      {commentBelongsToUser && (
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
            <MenuItem
              onClick={() => {
                handleEdit();
                handleClose();
              }}
            >
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
      )}
    </ListItem>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name[0],
  };
}
