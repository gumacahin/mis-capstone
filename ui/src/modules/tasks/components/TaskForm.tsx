import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type {
  Project,
  Section,
  Task,
  TaskFormFields,
  TaskPriority,
} from "@shared";
import DatePicker from "@shared/components/DatePicker";
import { useAddTask, useUpdateTask } from "@shared/hooks/queries";
import useProfileContext from "@shared/hooks/useProfileContext";
import useProjectContext from "@shared/hooks/useProjectContext";
import useSectionContext from "@shared/hooks/useSectionContext";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import DescriptionField from "./DescriptionField";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectButton from "./TaskProjectButton";
import TaskTagsButton from "./TaskTagsButton";
import TitleField from "./TitleField";

dayjs.extend(utc);

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
  const profile = useProfileContext()!;
  const inbox = profile.projects.find((p: Partial<Project>) => p.is_default)!;
  const inboxDefaultSection = inbox.sections.find(
    (s: Partial<Section>) => s.is_default,
  )!;
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
    rrule: task?.rrule ?? (presetDueDate ? "FREQ=DAILY;COUNT=1" : null),
    dtstart: task?.dtstart
      ? dayjs(task.dtstart).utc()
      : (presetDueDate?.startOf("day").utc() ?? null),
    anchor_mode: task?.anchor_mode ?? "SCHEDULED",
    project: task ? task.project : (project?.id ?? inbox?.id),
    section: task ? task.section : (section?.id ?? inboxDefaultSection?.id),
    priority: task?.priority ?? ("NONE" as TaskPriority),
    tags: task?.tags ?? (presetLabel ? [presetLabel] : []),
  };

  const form = useForm<TaskFormFields>({
    defaultValues,
  });

  const { control, handleSubmit, watch } = form;

  const isAdding = !task;

  const onSubmit: SubmitHandler<TaskFormFields> = async ({
    title,
    description,
    section,
    project,
    tags,
    priority,
    rrule,
    dtstart,
    anchor_mode,
  }) => {
    const data: Partial<TaskFormFields> = {
      title,
      description,
      section,
      tags,
      priority,
      project,
      rrule,
      dtstart,
      anchor_mode,
    };

    setLoading(true);
    try {
      if (isAdding) {
        await toast.promise(addTask(data), {
          loading: "Adding task...",
          success: "Task added successfully!",
          error: "Error adding task.",
        });
      } else {
        await toast.promise(updateTask(data), {
          loading: "Updating task...",
          success: "Task updated successfully!",
          error: "Error updating task.",
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
      <FormProvider {...form}>
        <CardContent>
          <Stack overflow="hidden" maxWidth={"100%"} spacing={2}>
            <TitleField control={control} onEnter={handleSubmit(onSubmit)} />
            <DescriptionField control={control} hideDescriptionIcon />
            <Stack spacing={1} direction="row" flexWrap={"wrap"} useFlexGap>
              <DatePicker />
              <TaskPriorityMenu control={control} priority={priority} />
              <TaskTagsButton control={control} tags={tags} />
            </Stack>
          </Stack>
        </CardContent>
      </FormProvider>
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
