import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  type DroppableProvided,
} from "@hello-pangea/dnd";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection, useReorderSections } from "../api";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import { ProjectDetail, Section } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import ProjectViewSectionHeader from "./ProjectViewSectionHeader";
import TaskList from "./TaskList";

export default function ProjectViewBoard({
  project,
}: {
  project: ProjectDetail;
}) {
  const reorderSections = useReorderSections(project.id);
  const handleDragEnd = async ({
    destination,
    source,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const projectSections = project.sections.filter((s) => !s.is_default);
    console.log("projectSections", projectSections);
    const newSectionList = Array.from(projectSections) as Section[];
    const [removed] = newSectionList.splice(source.index, 1);
    newSectionList.splice(destination.index, 0, removed);
    console.log("newSectionList", newSectionList);
    const reorderedSections = newSectionList.map(
      (section: Section, index: number) => ({
        ...section,
        order: index + 1,
      }),
    );
    console.log("reordered", reorderedSections);
    await toast.promise(reorderSections.mutateAsync(reorderedSections), {
      loading: "Reordering sections...",
      error: "Failed reordering sections.",
      success: "Sections reordered successfully!",
    });
  };

  const lastSection = project.sections[project.sections.length - 1];

  return (
    <ProjectContext.Provider value={project}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId={`project-${project.id}`}
          direction="horizontal"
          type="SECTION"
        >
          {(provided: DroppableProvided) => (
            <Stack
              direction="row"
              sx={{
                height: "100vh",
                overflowX: "auto",
                flex: "0 1 auto",
                minWidth: 300,
                alignItems: "start",
                justifyContent: "start",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {project.sections.map((section: Section, index) => (
                <SectionContext.Provider key={section.id} value={section}>
                  {section.is_default ? (
                    <Card
                      sx={{ minWidth: "300px", width: "100%" }}
                      key={section.id}
                      elevation={0}
                    >
                      <ProjectViewSectionHeader />
                      <TaskList />
                      <CardActions>
                        <AddTaskButton />
                      </CardActions>
                    </Card>
                  ) : (
                    <Draggable
                      draggableId={`draggable-section-${section.id}`}
                      // Adjust index to because of non-draggable default section
                      index={index - 1}
                    >
                      {(provided, snapshot) => (
                        <Card
                          sx={{ minWidth: "300px", width: "100%" }}
                          key={section.id}
                          elevation={0}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          variant={
                            snapshot.isDragging ? "outlined" : "elevation"
                          }
                        >
                          <ProjectViewSectionHeader />
                          <TaskList />
                          <CardActions>
                            <AddTaskButton />
                          </CardActions>
                        </Card>
                      )}
                    </Draggable>
                  )}
                  {lastSection.id !== section.id && (
                    <DividerButton precedingSection={section} />
                  )}
                </SectionContext.Provider>
              ))}
              <AddSectionButton precedingSection={lastSection} />
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </ProjectContext.Provider>
  );
}

type FormValues = {
  title: string;
};

function AddSectionForm({
  precedingSection,
  handleClose,
}: {
  precedingSection: Section;
  handleClose: () => void;
}) {
  const { mutateAsync } = useAddSection(precedingSection);
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
    handleClose();
  };
  const title = watch("title");
  return (
    <Stack
      minWidth={"300px"}
      spacing={1}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
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
          sx={{ textWrap: "nowrap" }}
          size="small"
          type="submit"
          variant="outlined"
          disabled={!title}
        >
          Add Section
        </Button>
        <Button size="small" onClick={handleClose}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

function DividerButton({ precedingSection }: { precedingSection: Section }) {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {open ? (
        <AddSectionForm
          precedingSection={precedingSection}
          handleClose={handleClose}
        />
      ) : (
        <Divider
          // component={Button}
          onClick={() => setOpen(true)}
          sx={{
            position: "relative",
            opacity: 0, // Initially hidden
            // FIXME: This is too fast to be useful
            transition: "opacity 0.1s ease-in-out", // Smooth fade-in/out
            "&:hover": {
              opacity: 1, // Fully visible on hover
            },
          }}
          orientation="vertical"
          variant="middle"
          flexItem
        >
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Centers the element
              whiteSpace: "nowrap",
            }}
          >
            Add Section
          </Typography>
        </Divider>
      )}
    </>
  );
}

function AddSectionButton({ precedingSection }: { precedingSection: Section }) {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      {open ? (
        <AddSectionForm
          precedingSection={precedingSection}
          handleClose={handleClose}
        />
      ) : (
        <Button
          startIcon={<SplitscreenIcon />}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
          size="small"
          sx={{ textWrap: "nowrap" }}
        >
          Add Section
        </Button>
      )}
    </Box>
  );
}
