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
import { useNavigate } from "react-router-dom";

import { useAddProject } from "../api";
import type { Project, ProjectViewType } from "../types/common";

type FormValues = {
  title: string;
  view: ProjectViewType;
};

export default function AddProjectDialog({
  open,
  handleClose,
  referenceProjectId,
  position,
}: {
  open: boolean;
  handleClose: () => void;
  referenceProjectId?: number;
  position?: "above" | "below";
}) {
  const addProject = useAddProject(referenceProjectId, position);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const defaultValues = {
    title: "",
    view: "list" as ProjectViewType,
  };
  const { register, setValue, handleSubmit, watch, reset } =
    useForm<FormValues>({ defaultValues });
  const view = watch("view");
  const onSubmit: SubmitHandler<Project> = async (data) => {
    setLoading(true);
    try {
      const project = await toast.promise(addProject.mutateAsync(data), {
        loading: "Adding project...",
        success: "Project added successfully!",
        error: "Error adding project.",
      });
      navigate(`/app/project/${project.id}/`);
    } catch (error) {
      console.error("Error adding project", error);
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
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            margin="dense"
            {...register("title", { required: true })}
            label="Project title"
            type="text"
            fullWidth
            variant="standard"
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
        <Button loading={isLoading} type="submit" variant="outlined">
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
