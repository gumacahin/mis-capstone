import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { describe, it } from "vitest";

import { TaskFormFields, TaskPriority } from "@/api/migration-helpers";

import DatePicker from "../DatePicker";

const section = {
  id: 4,
  title: "Test Section",
  is_default: false,
};

const project = {
  id: 1,
  title: "Test Project",
};
const inbox = {
  id: 2,
  title: "Inbox",
};
const inboxDefaultSection = {
  id: 3,
  title: "Default Section",
};

function FormProviderWrapper({ children }: { children: React.ReactNode }) {
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
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("DatePicker", () => {
  it("renders without crashing", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormProviderWrapper>
          <DatePicker value={null} onChange={() => {}} />
        </FormProviderWrapper>
      </LocalizationProvider>,
    );
  });
});
