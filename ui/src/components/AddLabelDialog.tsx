import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { MAX_LABEL_LENGTH } from "../constants/ui";
import { useAddTag } from "../hooks/queries";

type FormValues = {
  name: string;
};

export interface AddLabelDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddLabelDialog({
  open,
  handleClose,
}: AddLabelDialogProps) {
  const { mutateAsync: addTag } = useAddTag();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    name: "",
  };
  const { register, watch, reset, handleSubmit, setValue } =
    useForm<FormValues>({
      defaultValues,
    });
  const label = watch("name");
  const onSubmit: SubmitHandler<FormValues> = async ({ name }) => {
    setLoading(true);
    try {
      await toast.promise(addTag(name), {
        loading: "Adding label...",
        success: "Label added successfully!",
        error: "Failed to add label.",
      });
      navigate(`/label/${label}/`);
    } catch (error) {
      console.error("Error adding label", error);
    } finally {
      setLoading(false);
      reset();
      handleClose();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= MAX_LABEL_LENGTH) {
      setValue("name", e.target.value);
    }
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
        sx: { minWidth: { xs: "100vw", sm: 600 } },
      }}
    >
      <DialogTitle>Add Label</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          {...register("name", { required: true })}
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={label}
          onChange={handleInputChange}
          helperText={`${label.length}/${MAX_LABEL_LENGTH}`}
          slotProps={{
            formHelperText: {
              sx: {
                textAlign: "right",
                color: (theme) =>
                  label.length >= MAX_LABEL_LENGTH
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
              }, // Align helperText to the right
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={loading} type="submit" disabled={!label}>
          Add Label
        </Button>
      </DialogActions>
    </Dialog>
  );
}
