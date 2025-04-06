import { DragDropContext, DraggableLocation } from "@hello-pangea/dnd";
import { TextField, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection } from "../api";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import { ProjectDetail, Section } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import ProjectSectionHeader from "./ProjectViewSectionHeader";
import TaskList from "./TaskList";

type FormValues = {
  title: string;
};

const AddSectionButton = ({
  precedingSection,
}: {
  precedingSection: Section;
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
                  textWrap: "nowrap",
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

export default function ProjectViewList({
  project,
}: {
  project: ProjectDetail;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async ({
    destination,
    source,
    type,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
    type: string;
  }) => {
    setIsDragging(false);
  };
  return (
    <ProjectContext.Provider value={project}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Stack spacing={1} maxWidth="800px" width="100%" mx="auto">
          {project.sections.map((section: Section) => (
            <SectionContext.Provider value={section} key={section.id}>
              <Card key={section.id} elevation={0}>
                <ProjectSectionHeader />
                <TaskList />
                <CardActions>
                  <AddTaskButton />
                </CardActions>
              </Card>
              <AddSectionButton precedingSection={section} />
            </SectionContext.Provider>
          ))}
        </Stack>
      </DragDropContext>
    </ProjectContext.Provider>
  );
}
