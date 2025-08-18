import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import ProjectContext from "@shared/contexts/projectContext";
import { useUpdateSection } from "@shared/hooks/queries";
import type { Section } from "@shared/types/common";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function ProjectSectionEditDialog({
  open,
  handleClose,
  section,
}: {
  open: boolean;
  handleClose: () => void;
  section: Section;
}) {
  const project = useContext(ProjectContext)!;
  const updateSection = useUpdateSection(project.id, section.id);
  const [isLoading, setLoading] = useState(false);
  const defaultValues = {
    defaultValues: {
      title: section.title,
    },
  };
  const { register, handleSubmit, reset } = useForm<Section>(defaultValues);
  const onSubmit: SubmitHandler<Section> = async (data) => {
    setLoading(true);
    try {
      await toast.promise(updateSection.mutateAsync(data), {
        loading: "Updating section...",
        success: "Section updated successfully!",
        error: "Failed updating section.",
      });
    } catch (error) {
      console.error("Error updating section", error);
    } finally {
      setLoading(false);
      reset();
      handleClose();
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
      <DialogTitle>Update Section</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Section title"
          type="text"
          fullWidth
          variant="standard"
          {...register("title", { required: true })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={isLoading} type="submit">
          Update Section
        </Button>
      </DialogActions>
    </Dialog>
  );
}
