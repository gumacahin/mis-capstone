import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useUpdateLabel } from "../api";
import { MAX_LABEL_LENGTH } from "../constants/ui";
import type { Tag } from "../types/common";

export default function LabelEditDialog({
  open,
  handleClose,
  label,
}: {
  open: boolean;
  handleClose: () => void;
  label: Tag;
}) {
  const { mutateAsync: updateLabel } = useUpdateLabel(label);
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    defaultValues: {
      name: label.name,
    },
  };
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<Tag>(defaultValues);
  const name = watch("name");
  const onSubmit: SubmitHandler<Tag> = async (data) => {
    setLoading(true);
    try {
      await toast.promise(updateLabel(data), {
        loading: "Updating label...",
        success: "Label updated successfully!",
        error: "Failed updating label.",
      });
    } catch (error) {
      console.error("Error updating label", error);
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
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
          sx: { minWidth: { xs: "100vw", sm: 600 } },
        },
      }}
    >
      <DialogTitle>Update Label</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Label name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          {...register("name", { required: true })}
          onChange={handleInputChange}
          helperText={`${name.length}/${MAX_LABEL_LENGTH}`}
          slotProps={{
            formHelperText: {
              sx: {
                textAlign: "right",
                color: (theme) =>
                  name.length >= MAX_LABEL_LENGTH
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={loading} type="submit" variant="outlined">
          Update Label
        </Button>
      </DialogActions>
    </Dialog>
  );
}
