import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { TextField, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { DROPPABLE_TYPE_SECTION, DROPPABLE_TYPE_TASK } from "../constants/ui";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import {
  useAddSection,
  useReorderSections,
  useReorderTasks,
} from "../hooks/queries";
import { ProjectDetail, Section, Task } from "../types/common";
import AddTaskButton from "./AddTaskButton";
import ListProjectSectionCard from "./ListProjectSectionCard";
import ListTaskList from "./ListTaskList";
import ListViewContainer from "./ListViewContainer";
import ProjectSectionCardHeader from "./ProjectSectionCardHeader";

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
    <Box width={"100%"}>
      {open ? (
        <Stack spacing={1} component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            size="small"
            id="section-title"
            aria-label="Section Name"
            placeholder="Name this section"
            {...register("title", { required: true })}
          />
          <Stack justifyContent="start" direction="row" spacing={1}>
            <Button size="small" type="submit" disabled={!title}>
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
  const { mutateAsync: reorderSections } = useReorderSections(project.id);
  const { mutateAsync: reorderTasks } = useReorderTasks(project.id);

  const handleSectionDragEnd = async (
    source: DraggableLocation,
    destination: DraggableLocation | null,
  ) => {
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
    const newSectionList = Array.from(projectSections) as Section[];
    const [removed] = newSectionList.splice(source.index, 1);
    newSectionList.splice(destination.index, 0, removed);
    const reorderedSections = newSectionList.map(
      (section: Section, index: number) => ({
        ...section,
        order: index + 1,
      }),
    );
    await toast.promise(reorderSections(reorderedSections), {
      loading: "Reordering sections...",
      error: "Failed reordering sections.",
      success: "Sections reordered successfully!",
    });
  };

  const handleTaskDragEnd = async (
    source: DraggableLocation,
    destination: DraggableLocation | null,
  ) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceSection = project.sections.find(
      (s) => s.id === Number(source.droppableId.split("-")[1]),
    );
    const destinationSection = project.sections.find(
      (s) => s.id === Number(destination.droppableId.split("-")[1]),
    );

    if (!sourceSection || !destinationSection) {
      return;
    }

    const isSameSection = sourceSection.id === destinationSection.id;
    const newSourceTaskList = Array.from(sourceSection.tasks);
    const newDestinationTaskList = isSameSection
      ? newSourceTaskList
      : Array.from(destinationSection.tasks);
    const [removed] = newSourceTaskList.splice(source.index, 1);
    newDestinationTaskList.splice(destination.index, 0, removed);
    const reorderedSourceTasks = newSourceTaskList.map(
      (task: Task, index: number) => ({
        ...task,
        order: index + 1,
      }),
    );
    const reorderedDestinationTasks = newDestinationTaskList.map(
      (task: Task, index: number) => ({
        ...task,
        order: index + 1,
      }),
    );
    const updatedTask = reorderedDestinationTasks[destination.index];
    updatedTask.section = destinationSection.id;

    await toast.promise(
      reorderTasks({
        sourceSectionId: sourceSection.id,
        reorderedSourceTasks,
        destinationSectionId: destinationSection.id,
        reorderedDestinationTasks,
        task: updatedTask,
      }),
      {
        loading: "Reordering tasks...",
        error: "Failed reordering tasks.",
        success: "Tasks reordered successfully!",
      },
    );
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
    if (type === DROPPABLE_TYPE_SECTION) {
      await handleSectionDragEnd(source, destination);
    } else if (type === DROPPABLE_TYPE_TASK) {
      await handleTaskDragEnd(source, destination);
    }
  };

  return (
    <ProjectContext.Provider value={project}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId={`project-${project.id}`}
          direction="vertical"
          type={DROPPABLE_TYPE_SECTION}
        >
          {(provided: DroppableProvided) => (
            <ListViewContainer
              id="project-sections-list-view-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {project.sections.map((section: Section, index: number) => (
                <SectionContext.Provider value={section} key={section.id}>
                  {section.is_default ? (
                    <>
                      <ListProjectSectionCard key={section.id}>
                        <ProjectSectionCardHeader />
                        <ListTaskList />
                        <CardActions>
                          <AddTaskButton />
                        </CardActions>
                      </ListProjectSectionCard>
                      <AddSectionButton precedingSection={section} />
                    </>
                  ) : (
                    <Draggable
                      draggableId={`draggable-section-${section.id}`}
                      // Adjust index to because of non-draggable default section
                      index={index - 1}
                    >
                      {(provided, snapshot) => (
                        <Fragment key={section.id}>
                          <ListProjectSectionCard
                            key={section.id}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            variant={
                              snapshot.isDragging ? "outlined" : "elevation"
                            }
                          >
                            <ProjectSectionCardHeader />
                            <ListTaskList hideProject />
                            <CardActions>
                              <AddTaskButton />
                            </CardActions>
                          </ListProjectSectionCard>
                          <AddSectionButton precedingSection={section} />
                        </Fragment>
                      )}
                    </Draggable>
                  )}
                </SectionContext.Provider>
              ))}
            </ListViewContainer>
          )}
        </Droppable>
      </DragDropContext>
    </ProjectContext.Provider>
  );
}
