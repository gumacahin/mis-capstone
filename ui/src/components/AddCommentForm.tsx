import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAddComment } from "../api";
import type { Task } from "../types/common";
import { stringAvatar } from "../utils.ts";

export default function AddCommentForm({
  task,
  userDisplayName,
}: {
  task: Task;
  userDisplayName: string;
}) {
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const addComment = useAddComment(task);
  const handleSubmit = async () => {
    setIsLoading(true);
    toast.promise(
      addComment.mutateAsync(
        {
          body: comment,
          task_id: task.id,
          date: dayjs().format("YYYY-MM-DD"),
        },
        {
          onSuccess: () => {
            setComment("");
            setAddCommentOpen(false);
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      ),
      {
        loading: "Adding  comment...",
        success: "Comment added successfully!",
        error: "Error: Failed adding comment.",
      },
    );
  };

  return (
    <>
      {!addCommentOpen && (
        <List>
          <ListItem>
            <ListItemIcon>
              <Avatar {...stringAvatar(userDisplayName)} />
            </ListItemIcon>
            <ListItemText
              primary={
                <TextField
                  fullWidth
                  placeholder="Comment"
                  onClick={() => {
                    setAddCommentOpen(true);
                  }}
                />
              }
            />
          </ListItem>
        </List>
      )}
      {addCommentOpen && (
        <Stack my={3} spacing={1}>
          <TextField
            id="comment"
            label="Comment"
            multiline
            fullWidth
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
          <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
            <Button
              onClick={() => {
                setAddCommentOpen(false);
              }}
              variant="text"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              Add Comment
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  );
}
