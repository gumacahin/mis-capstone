import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection } from "../api";
import { IProject, ISection } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import ProjectViewSectionHeader from "./ProjectViewSectionHeader";
import TaskList from "./TaskList";

type FormValues = {
  title: string;
};

const AddSectionButton = ({ section }: { section: ISection }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useAddSection(section.project, section.order);
  const defaultValues = { title: "" };
  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const onSubmit = async (formValues: FormValues) => {
    await toast.promise(mutateAsync(formValues), {
      loading: "Adding section...",
      success: "Section added successfully!",
      error: "Error adding section.",
    });
    reset(defaultValues);
    setOpen(false);
  };
  const title = watch("title");
  return (
    <Box>
      {open ? (
        <Stack spacing={1} component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size="small"
            id="section-title"
            aria-label="Section Name"
            variant="outlined"
            placeholder="Name this section"
            {...register("title", { required: true })}
          />
          <Stack justifyContent="start" direction="row" spacing={1}>
            <Button
              size="small"
              type="submit"
              variant="outlined"
              disabled={!title}
            >
              Add Section
            </Button>
            <Button size="small" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          startIcon={<SplitscreenIcon />}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Section
        </Button>
      )}
    </Box>
  );
};

export default function ProjectViewBoard({ project }: { project: IProject }) {
  const lastSection = project.sections[project.sections.length - 1];
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        height: "100vh",
        overflowX: "auto",
        flex: "0 1 auto",
        minWidth: 300,
        alignItems: "start",
        justifyContent: "start",
      }}
    >
      {project.sections.map((section) => (
        <Stack
          key={section.id}
          sx={{
            minWidth: 300,
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <ProjectViewSectionHeader section={section} />
          <TaskList section={section} />
          <AddTaskButton sectionId={section.id} projectId={project.id} />
        </Stack>
      ))}
      <AddSectionButton section={lastSection} />
    </Stack>
  );
}
