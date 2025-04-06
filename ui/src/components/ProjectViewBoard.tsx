import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  type DroppableProvided,
} from "@hello-pangea/dnd";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useReorderSections, useReorderTasks } from "../api";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import useScrollbarWidth from "../hooks/useScrollbarWidth";
import { ProjectDetail, Section, Task } from "../types/common";
import AddProjectSectionButton from "./AddProjectSectionButton";
import AddTaskButton from "./AddTaskButton";
import ProjectSectionDivider from "./ProjectSectionDivider";
import ProjectViewSectionHeader from "./ProjectViewSectionHeader";
import TaskList from "./TaskList";

const SECTION = "SECTION";

export default function ProjectViewBoard({
  project,
}: {
  project: ProjectDetail;
}) {
  const { mutateAsync: reorderSections } = useReorderSections(project.id);
  const { mutateAsync: reorderTasks } = useReorderTasks(project.id);
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarWidth = useScrollbarWidth();

  const handleDragStart = () => {
    setIsDragging(true);
  };

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
    setIsDragging(false);
    if (type === SECTION) {
      await handleSectionDragEnd(source, destination);
    } else if (type === "TASK") {
      await handleTaskDragEnd(source, destination);
    }
  };

  const lastSection = project.sections[project.sections.length - 1];

  return (
    <ProjectContext.Provider value={project}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable
          droppableId={`project-${project.id}`}
          direction="horizontal"
          type={SECTION}
        >
          {(provided: DroppableProvided) => (
            <Stack
              id="project-sections-board-view-container"
              direction="row"
              sx={{
                minHeight: (theme) =>
                  `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${scrollbarWidth}px)`,
                overflowX: "auto",
                flex: "0 1 auto",
                // minWidth: 300,
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
                    <ProjectSectionDivider
                      disabled={isDragging}
                      precedingSection={section}
                    />
                  )}
                </SectionContext.Provider>
              ))}
              {provided.placeholder}
              <AddProjectSectionButton precedingSection={lastSection} />
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </ProjectContext.Provider>
  );
}
