import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import type { AnchorMode, TaskFormFields } from "@/api/migration-helpers";

import RepeatOptionsCustom from "../RepeatOptionsCustom";

function FormProviderWrapper({
  children,
  rrule = null,
  anchor_mode = "SCHEDULED",
  dtstart = dayjs().startOf("day"),
}: {
  children: React.ReactNode;
  rrule?: string | null;
  anchor_mode?: AnchorMode | null;
  dtstart?: dayjs.Dayjs | null;
}) {
  const defaultValues: TaskFormFields = {
    title: "",
    description: "",
    due_date: null,
    project: 1,
    section: 1,
    priority: "NONE",
    tags: [],
    dtstart,
    rrule,
    anchor_mode,
    completion_date: null,
  };
  const form = useForm<TaskFormFields>({ defaultValues });
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("RepeatOptionsCustom", () => {
  it("renders the custom repeat dialog when open", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptionsCustom
          open={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          dtstart={dayjs()}
          rrule={null}
          anchor_mode={"SCHEDULED"}
        />
      </FormProviderWrapper>,
    );
    expect(screen.getByText(/custom repeat/i)).toBeInTheDocument();
    expect(screen.getByText(/Based on/i)).toBeInTheDocument();
    expect(screen.getByText(/Every/i)).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <FormProviderWrapper>
        <RepeatOptionsCustom
          open={true}
          onClose={onClose}
          onSave={vi.fn()}
          dtstart={dayjs()}
          rrule={null}
          anchor_mode={"SCHEDULED"}
        />
      </FormProviderWrapper>,
    );
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onSave when Save is clicked", async () => {
    const onSave = vi.fn();
    render(
      <FormProviderWrapper>
        <RepeatOptionsCustom
          open={true}
          onClose={vi.fn()}
          onSave={onSave}
          dtstart={dayjs("2024-01-01")}
          rrule={null}
          anchor_mode={"SCHEDULED"}
        />
      </FormProviderWrapper>,
    );
    // Save button should exist
    const saveBtn = screen.getByRole("button", { name: /save/i });
    expect(saveBtn).toBeEnabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("renders radio options for anchor mode", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptionsCustom
          open={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          dtstart={dayjs()}
          rrule={null}
          anchor_mode={"SCHEDULED"}
        />
      </FormProviderWrapper>,
    );
    expect(screen.getByLabelText(/scheduled date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed date/i)).toBeInTheDocument();
  });

  it("renders interval input for 'Every'", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptionsCustom
          open={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          dtstart={dayjs()}
          rrule={null}
          anchor_mode={"SCHEDULED"}
        />
      </FormProviderWrapper>,
    );
    const intervalInput = screen.getByRole("spinbutton");
    expect(intervalInput).toBeInTheDocument();
    expect(intervalInput).toHaveAttribute("type", "number");
  });
});
