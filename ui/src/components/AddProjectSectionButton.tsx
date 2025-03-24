import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection } from "../api";
import { ProjectViewType } from "../types/common";
type FormValues = {
  title: string;
};

export default function AddProjectSectionButton({
  projectId,
  view,
}: {
  projectId: number;
  view: ProjectViewType;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useAddSection(projectId);
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
  const title = watch("title");
  const isList = view === ("list" as ProjectViewType);
  const isClosedListView = isList && !open;
  const isClosedBoardView = !isList && open;

  return (
    <Box>
      {open && (
        <Stack
          maxWidth={600}
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
      )}
      {isClosedListView && <BoardViewButton setOpen={setOpen} />}
      {isClosedBoardView && (
        <Button
          startIcon={<SplitscreenIcon />}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Section
        </Button>
      )}
    </Box>
  );
}

function BoardViewButton({ setOpen }: { setOpen: (value: boolean) => void }) {
  return (
    <Button
      fullWidth
      variant="text"
      onClick={() => {
        setOpen(true);
      }}
    >
      Add Section
    </Button>
  );
}
