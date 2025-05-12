import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddSection } from "../hooks/queries";
import { Section } from "../types/common";

export type ProjectSectionFormFields = {
  title: string;
};

export default function AddProjectSectionForm({
  precedingSection,
  handleClose,
}: {
  precedingSection: Section;
  handleClose: () => void;
}) {
  const { mutateAsync } = useAddSection(precedingSection);
  const defaultValues = { title: "" };
  const { register, handleSubmit, watch, reset } =
    useForm<ProjectSectionFormFields>({
      defaultValues,
    });
  const onSubmit = async (formValues: ProjectSectionFormFields) => {
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
        placeholder="Name this section"
        {...register("title", { required: true })}
      />
      <Stack justifyContent="start" direction="row" spacing={1}>
        <Button
          sx={{ textWrap: "nowrap" }}
          size="small"
          type="submit"
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
