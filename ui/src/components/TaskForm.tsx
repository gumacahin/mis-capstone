import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
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
import type { IAddTaskFields, ITask, TTaskPriority } from "../types/common";
import DueDatePicker from "./DueDatePicker";
import TaskLabelsMenu from "./TaskLabelsMenu";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectMenu from "./TaskProjectMenu";

export default function TaskForm({
  presetDueDate = null,
  handleClose,
}: {
  presetDueDate?: Dayjs | null;
  task?: ITask;
  handleClose: () => void;
}) {
  const project = useContext(ProjectContext)!;
  const section = useContext(SectionContext);
  const { projects } = useContext(ProfileContext)!;
  const inbox = projects.find((p) => p.is_default)!;
  const inboxDefaultSection = inbox.sections.find((s) => s.is_default);

  const addTask = useAddTask(project.id);
  const defaultValues = {
    title: "",
    description: "",
    due_date: presetDueDate,
    project_id: project ? project.id : inbox?.id,
    section_id: section ? section.id : inboxDefaultSection?.id,
    priority: "NONE" as TTaskPriority,
    labels: [],
  };

  const { control, register, handleSubmit, watch } = useForm<IAddTaskFields>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<IAddTaskFields> = async ({
    title,
    description,
    due_date,
    section_id,
    project_id,
  }) => {
    const data: ITask = {
      title,
      description,
      section_id,
      due_date: due_date != null ? due_date.format("YYYY-MM-DD") : null,
      project_id,
    };
    toast.promise(addTask.mutateAsync(data), {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: "Error adding task.",
    });
    handleClose();
  };

  const dueDate = watch("due_date");
  const priority = watch("priority");
  const labels = watch("labels");
  const sectionId = watch("section_id");

  return (
    <Stack
      overflow="hidden"
      maxWidth={"100%"}
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
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
        <TaskProjectMenu control={control} sectionId={sectionId} />
        <DueDatePicker control={control} dueDate={dueDate} />
        <TaskPriorityMenu control={control} priority={priority} />
        <TaskLabelsMenu control={control} labels={labels} />
      </Stack>
      <Stack spacing={1} direction="row" justifyContent={"end"}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="outlined">
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
