import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddTask, useUpdateTask } from "../hooks/queries";
import useProfileContext from "../hooks/useProfileContext";
import useProjectContext from "../hooks/useProjectContext";
import useSectionContext from "../hooks/useSectionContext";
import type { Task, TaskFormFields, TaskPriority } from "../types/common";
import DatePicker from "./DatePicker";
import DescriptionField from "./DescriptionField";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectButton from "./TaskProjectButton";
import TaskTagsButton from "./TaskTagsButton";
import TitleField from "./TitleField";

export interface TaskFormProps {
  presetDueDate?: Dayjs;
  presetLabel?: string;
  taskAbove?: number;
  taskBelow?: number;
  handleClose: () => void;
  task?: Task;
}

export default function TaskForm({
  taskAbove,
  taskBelow,
  presetDueDate,
  presetLabel,
  handleClose,
  task,
}: TaskFormProps) {
  const project = useProjectContext();
  const section = useSectionContext();
  const { projects } = useProfileContext();
  const inbox = projects.find((p) => p.is_default)!;
  const inboxDefaultSection = inbox.sections.find((s) => s.is_default);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: addTask } = useAddTask({
    projectId: project.id,
    aboveTaskId: taskAbove,
    belowTaskId: taskBelow,
  });
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const defaultValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ?? presetDueDate ?? null,
    project: task ? task.project : (project?.id ?? inbox?.id),
    section: task ? task.section : (section?.id ?? inboxDefaultSection?.id),
    priority: task?.priority ?? ("NONE" as TaskPriority),
    tags: task?.tags ?? (presetLabel ? [presetLabel] : []),
  };

  const { control, handleSubmit, watch } = useForm<TaskFormFields>({
    defaultValues,
  });

  const isAdding = !task;

  const onSubmit: SubmitHandler<TaskFormFields> = async ({
    title,
    description,
    due_date,
    section,
    project,
    tags,
    priority,
  }) => {
    const data: Partial<TaskFormFields> = {
      title,
      description,
      section,
      due_date,
      tags,
      priority,
      project,
    };

    setLoading(true);
    try {
      if (isAdding) {
        await toast.promise(addTask(data), {
          loading: "Adding task...",
          success: "Task added successfully!",
          error: "Failed to add task.",
        });
      } else {
        await toast.promise(updateTask(data), {
          loading: "Updating task...",
          success: "Task updated successfully!",
          error: "Failed to update task.",
        });
      }
    } catch (error) {
      console.error("Error adding/updating task:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const title = watch("title");
  const priority = watch("priority");
  const tags = watch("tags");
  const sectionId = watch("section");
  const titleIsEmpty = title === "" || title === "<p></p>";

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      variant="outlined"
      sx={{ width: "100%", maxWidth: "100%" }}
    >
      <CardContent>
        <Stack overflow="hidden" maxWidth={"100%"} spacing={2}>
          <TitleField control={control} onEnter={handleSubmit(onSubmit)} />
          <DescriptionField control={control} hideDescriptionIcon />
          <Stack spacing={1} direction="row" flexWrap={"wrap"} useFlexGap>
            <DatePicker control={control} />
            <TaskPriorityMenu control={control} priority={priority} />
            <TaskTagsButton control={control} tags={tags} />
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <TaskProjectButton
          control={control}
          projectId={project.id}
          sectionId={sectionId}
        />
        <Stack spacing={1} direction="row">
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={titleIsEmpty} loading={loading} type="submit">
            Save
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
