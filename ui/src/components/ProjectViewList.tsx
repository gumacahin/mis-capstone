import { TextField, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection } from "../api";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import { IProject, ISection } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import ProjectSectionHeader from "./ProjectViewSectionHeader";
import TaskList from "./TaskList";

type FormValues = {
  title: string;
};

const AddSectionButton = ({
  precedingSection,
}: {
  precedingSection: ISection;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useAddSection(precedingSection);
  const defaultValues = { title: "" };
  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = (formValues: FormValues) => {
    toast.promise(mutateAsync(formValues), {
      loading: "Adding section...",
      success: "Section added successfully!",
      error: "Error adding section.",
    });
    reset(defaultValues);
    setOpen(false);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const title = watch("title");
  return (
    <Box>
      {open ? (
        <Stack spacing={1} component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
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
          sx={{
            ...(isMobile
              ? {} // No styles for mobile
              : {
                  opacity: 0,
                  transition: "opacity 0.3s ease-in-out",
                  "&:hover": { opacity: 1 },
                  "&:mouseout": { opacity: 0 },
                }),
          }}
          fullWidth
          variant="text"
          size="small"
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

export default function ProjectViewList({ project }: { project: IProject }) {
  return (
    <ProjectContext.Provider value={project}>
      <Stack>
        {project.sections.map((section: ISection) => (
          <SectionContext.Provider value={section} key={section.id}>
            <Box key={section.id} mb={3}>
              <ProjectSectionHeader />
              <TaskList tasks={section.tasks} />
              <AddTaskButton />
              <AddSectionButton precedingSection={section} />
            </Box>
          </SectionContext.Provider>
        ))}
      </Stack>
    </ProjectContext.Provider>
  );
}
