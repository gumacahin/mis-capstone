import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDeleteLabel } from "@shared/hooks/queries";
import { Tag } from "@shared/types/common";
import { useState } from "react";
import { toast } from "react-hot-toast";

export interface LabelDeleteDialogProps {
  open: boolean;
  label: Tag;
  handleClose: () => void;
}

export default function LabelDeleteDialog({
  open,
  label,
  handleClose,
}: LabelDeleteDialogProps) {
  const { mutateAsync: deleteLabel } = useDeleteLabel(label);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await toast.promise(deleteLabel(), {
        loading: "Deleting label...",
        success: "Label deleted successfully!",
        error: "Failed deleting label.",
      });
    } catch (error) {
      console.error("Error deleting label:", error);
    } finally {
      setLoading(false);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Label</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the label &quot;{label.name}&quot;?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
