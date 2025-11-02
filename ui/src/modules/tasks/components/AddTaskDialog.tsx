import { DialogActions } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import type { Project, Section, TaskFormFields, TaskPriority } from "@shared";
import DatePicker from "@shared/components/DatePicker";
import { useAddTask } from "@shared/hooks/queries";
import useProfileContext from "@shared/hooks/useProfileContext";
import useProjectContext from "@shared/hooks/useProjectContext";
import useSectionContext from "@shared/hooks/useSectionContext";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import DescriptionField from "./DescriptionField";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectButton from "./TaskProjectButton";
import TaskTagsButton from "./TaskTagsButton";
import TitleField from "./TitleField";

export type FormValues = {
  title: string;
  description: string | null;
  due_date: Dayjs | null;
  section: number | null;
};

export default function AddTaskDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
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
  });
  const defaultValues = {
    title: "",
    description: "",
    due_date: null,
    project: project?.id ?? inbox?.id,
    section: section?.id ?? inboxDefaultSection?.id,
    priority: "NONE" as TaskPriority,
    tags: [],
    // Add missing scheduling fields
    dtstart: dayjs().startOf("day"), // Default to today
    rrule: null,
    anchor_mode: "SCHEDULED" as const,
  };

  const form = useForm<TaskFormFields>({
    defaultValues,
  });

  const { control, handleSubmit, watch, reset } = form;

  const onSubmit: SubmitHandler<TaskFormFields> = async ({
    title,
    description,
    due_date,
    section,
    project,
    tags,
    priority,
    dtstart,
    rrule,
    anchor_mode,
  }) => {
    setLoading(true);
    const data: Partial<TaskFormFields> = {
      title,
      description,
      section,
      due_date,
      tags,
      priority,
      project,
      // Include scheduling fields
      dtstart,
      rrule,
      anchor_mode,
    };

    try {
      await toast.promise(addTask(data), {
        loading: "Adding task...",
        success: "Task added successfully!",
        error: "Error adding task.",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
    reset(defaultValues);
    handleClose();
  };

  const priority = watch("priority");
  const tags = watch("tags");
  const sectionId = watch("section");
  return (
    <Dialog component="form" open={open} onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <DialogTitle>
          <TitleField control={control} onEnter={handleSubmit(onSubmit)} />
        </DialogTitle>
        <DialogContent>
          <Stack overflow="hidden" maxWidth={"100%"} spacing={2}>
            <DescriptionField control={control} hideDescriptionIcon />
            <Stack spacing={1} direction="row" flexWrap={"wrap"} useFlexGap>
              <DatePicker />
              <TaskPriorityMenu control={control} priority={priority} />
              <TaskTagsButton control={control} tags={tags} />
            </Stack>
          </Stack>
        </DialogContent>
      </FormProvider>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <TaskProjectButton
          control={control}
          projectId={project.id}
          sectionId={sectionId}
        />
        <Stack spacing={1} direction="row">
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={loading} type="submit">
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
