import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import toast from "react-hot-toast";

import { useComments, useDeleteComment } from "../api";
import { Comment as CommentType, Task } from "../types/common";
import Comment from "./Comment";

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: 0,
  margin: 0,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
}));

function DeleteCommentDialog({
  handleClose,
  comment,
}: {
  handleClose: () => void;
  comment: CommentType;
}) {
  const deleteComment = useDeleteComment(comment);
  const handleDelete = () => {
    toast.promise(deleteComment.mutateAsync(), {
      loading: "Deleting comment...",
      success: "Comment deleted successfully!",
      error: "Error: Failed deleting comment.",
    });
    handleClose();
  };
  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogTitle>Delete comment?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This comment will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Back</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CommentList({ task }: { task: Task }) {
  const { isPending, isError, data } = useComments(task);
  const [commentForDeletion, setCommentForDeletion] =
    useState<CommentType | null>(null);

  if (isError) {
    return <Alert severity="error">Failed to load comments</Alert>;
  }

  if (isPending || !data || data.count === 0) {
    return null;
  }

  return (
    <Box my={2}>
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ background: "inherit" }}
      >
        <AccordionSummary aria-controls="overdue-content" id="overdue-header">
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"start"}
            width={"100%"}
          >
            <Typography variant={"h6"} component={"h3"}>
              Comments
            </Typography>
            <Typography margin={1}>{data.count}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails id="overdue-content" sx={{ padding: 0 }}>
          <List disablePadding>
            {data.results.map((comment: CommentType) => (
              <Comment
                comment={comment}
                key={comment.id}
                handleDelete={() => {
                  setCommentForDeletion(comment);
                }}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      {commentForDeletion && (
        <DeleteCommentDialog
          handleClose={() => setCommentForDeletion(null)}
          comment={commentForDeletion}
        />
      )}
    </Box>
  );
}
