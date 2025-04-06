import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dayjs } from "dayjs";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddTask } from "../api";
import ProfileContext from "../contexts/profileContext";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import type { Task, TaskFormFields, TaskPriority } from "../types/common";
import DatePicker from "./DatePicker";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectButton from "./TaskProjectButton";
import TaskTagsButton from "./TaskTagsButton";

export default function TaskForm({
  taskAbove,
  taskBelow,
  compact,
  presetDueDate = null,
  handleClose,
  task,
}: {
  presetDueDate?: Dayjs | null;
  taskAbove?: number;
  taskBelow?: number;
  handleClose: () => void;
  compact?: boolean;
  task?: Task;
}) {
  const project = useContext(ProjectContext)!;
  const section = useContext(SectionContext);
  const { projects } = useContext(ProfileContext)!;
  const inbox = projects.find((p) => p.is_default)!;
  const inboxDefaultSection = inbox.sections.find((s) => s.is_default);
  console.log("compact", compact);

  const addTask = useAddTask({
    projectId: project.id,
    aboveTaskId: taskAbove,
    belowTaskId: taskBelow,
  });
  const defaultValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ?? presetDueDate,
    project: task ? task.project : (project?.id ?? inbox?.id),
    section: task ? task.section : (section?.id ?? inboxDefaultSection?.id),
    priority: task?.priority ?? ("NONE" as TaskPriority),
    tags: task?.tags ?? [],
  };

  const { control, register, handleSubmit, watch } = useForm<TaskFormFields>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<TaskFormFields> = async ({
    title,
    description,
    due_date,
    section,
    project,
  }) => {
    const data: Partial<TaskFormFields> = {
      title,
      description,
      section,
      due_date,
      priority,
      project,
    };
    toast.promise(addTask.mutateAsync(data), {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: "Error adding task.",
    });
    handleClose();
  };

  const priority = watch("priority");
  const tags = watch("tags");
  const sectionId = watch("section");

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      variant="outlined"
      sx={{ width: "100%", maxWidth: "100%" }}
    >
      <CardContent>
        <Stack overflow="hidden" maxWidth={"100%"} spacing={2}>
          <TextField
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            required
            margin="dense"
            id="title"
            label="Task name"
            type="text"
            fullWidth
            variant="standard"
            {...register("title")}
          />
          <TextField
            multiline
            margin="dense"
            id="desciption"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            {...register("description")}
          />
          <Stack spacing={1} direction="row" flexWrap={"wrap"} useFlexGap>
            <DatePicker control={control} compact={compact} />
            <TaskPriorityMenu
              control={control}
              priority={priority}
              compact={compact}
            />
            <TaskTagsButton control={control} tags={tags} compact={compact} />
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <TaskProjectButton
          control={control}
          projectId={project.id}
          sectionId={sectionId}
          compact={compact}
        />
        <Stack spacing={1} direction="row">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
