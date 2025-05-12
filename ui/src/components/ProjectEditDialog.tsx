import ListIcon from "@mui/icons-material/List";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useUpdateProject } from "../hooks/queries";
import type { ProjectDetail } from "../types/common";

export default function ProjectEditDialog({
  open,
  handleClose,
  project,
}: {
  open: boolean;
  handleClose: () => void;
  project: ProjectDetail;
}) {
  const updateProject = useUpdateProject(project.id);
  const [isLoading, setLoading] = useState(false);
  const defaultValues = {
    defaultValues: {
      title: project.title,
      view: project.view,
    },
  };
  const { register, setValue, handleSubmit, watch, reset } =
    useForm<ProjectDetail>(defaultValues);
  const view = watch("view");
  const onSubmit: SubmitHandler<ProjectDetail> = async (data) => {
    setLoading(true);
    try {
      await toast.promise(updateProject.mutateAsync(data), {
        loading: "Updating project...",
        success: "Project updated successfully!",
        error: "Failed updating project.",
      });
    } catch (error) {
      console.error("Error updating project", error);
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
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            margin="dense"
            label="Project title"
            type="text"
            fullWidth
            variant="standard"
            {...register("title", { required: true })}
          />
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              id="view-options-label"
              disabled={isLoading}
            >
              View options
            </FormLabel>
            <ToggleButtonGroup
              sx={{ mt: 1 }}
              disabled={isLoading}
              id="view-options-label"
              exclusive
              size="large"
              aria-label="view options"
              aria-labelledby="view-options-label"
              {...register("view")}
              value={view}
              onChange={(_, value) => setValue("view", value)}
            >
              <ToggleButton value="list" aria-label="list view">
                <Stack alignItems={"center"} spacing={2}>
                  <ListIcon />
                  <Typography>List View</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="board" aria-label="board view">
                <Stack alignItems={"center"} spacing={2}>
                  <ViewModuleIcon />
                  <Typography>Board View</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={isLoading} type="submit">
          Update Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
