import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  type DroppableProvided,
} from "@hello-pangea/dnd";
import CardActions from "@mui/material/CardActions";
import {
  DROPPABLE_TYPE_SECTION,
  DROPPABLE_TYPE_TASK,
} from "@shared/constants/ui";
import ProjectContext from "@shared/contexts/projectContext";
import SectionContext from "@shared/contexts/sectionContext";
import { useReorderSections, useReorderTasks } from "@shared/hooks/queries";
import { ProjectDetail, Section, Task } from "@shared/types/common";
import AddTaskButton from "@tasks/components/AddTaskButton";
import BoardTaskList from "@tasks/components/BoardTaskList";
import BoardViewContainer from "@views/components/BoardViewContainer";
import { memo, useState } from "react";
import { toast } from "react-hot-toast";

import AddProjectSectionButton from "./AddProjectSectionButton";
import BoardProjectSectionCard from "./BoardProjectSectionCard";
import ProjectViewSectionCardHeader from "./ProjectSectionCardHeader";
import ProjectSectionDivider from "./ProjectSectionDivider";

interface InnerListProps {
  sections: Section[];
  isDragging: boolean;
  lastSection: Section;
}

const InnerList = memo(function InnerList({
  sections,
  isDragging,
  lastSection,
}: InnerListProps) {
  return (
    <>
      {sections.map((section: Section, index) => (
        <SectionContext.Provider key={section.id} value={section}>
          {section.is_default ? (
            <BoardProjectSectionCard key={section.id}>
              <ProjectViewSectionCardHeader />
              <BoardTaskList hideProject />
              <CardActions>
                <AddTaskButton />
              </CardActions>
            </BoardProjectSectionCard>
          ) : (
            <Draggable
              draggableId={`draggable-section-${section.id}`}
              // Adjust index to because of non-draggable default section
              index={index - 1}
            >
              {(provided, snapshot) => (
                <BoardProjectSectionCard
                  key={section.id}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  variant={snapshot.isDragging ? "outlined" : "elevation"}
                >
                  <ProjectViewSectionCardHeader />
                  <BoardTaskList hideProject />
                  <CardActions>
                    <AddTaskButton />
                  </CardActions>
                </BoardProjectSectionCard>
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
    </>
  );
});

export default function ProjectViewBoard({
  project,
}: {
  project: ProjectDetail;
}) {
  const { mutateAsync: reorderSections } = useReorderSections(project.id);
  const { mutateAsync: reorderTasks } = useReorderTasks(project.id);
  const [isDragging, setIsDragging] = useState(false);

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
    if (type === DROPPABLE_TYPE_SECTION) {
      await handleSectionDragEnd(source, destination);
    } else if (type === DROPPABLE_TYPE_TASK) {
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
          type={DROPPABLE_TYPE_SECTION}
        >
          {(provided: DroppableProvided) => (
            <BoardViewContainer
              id="project-sections-board-view-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <InnerList
                sections={project.sections}
                isDragging={isDragging}
                lastSection={lastSection}
              />
              {provided.placeholder}
              <AddProjectSectionButton precedingSection={lastSection} />
            </BoardViewContainer>
          )}
        </Droppable>
      </DragDropContext>
    </ProjectContext.Provider>
  );
}
