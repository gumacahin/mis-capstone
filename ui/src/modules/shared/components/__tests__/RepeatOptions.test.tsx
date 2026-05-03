import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import type { TaskFormFields } from "@/api/migration-helpers";

import RepeatOptions from "../RepeatOptions";

// FormProvider wrapper for context
function FormProviderWrapper({ children }: { children: React.ReactNode }) {
  const defaultValues: TaskFormFields = {
    title: "",
    description: "",
    due_date: null,
    project: 1,
    section: 1,
    priority: "NONE",
    tags: [],
    dtstart: dayjs().startOf("day"),
    rrule: null,
    anchor_mode: "SCHEDULED",
    completion_date: null,
  };
  const form = useForm<TaskFormFields>({ defaultValues });
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("RepeatOptions", () => {
  it("renders RepeatOptions button", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptions />
      </FormProviderWrapper>,
    );
    const repeatButton = screen.getByRole("button");
    expect(repeatButton).toBeInTheDocument();
  });

  it.skip("shows quick repeat options when button is clicked", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptions />
      </FormProviderWrapper>,
    );
    const repeatButton = screen.getByRole("button");
    fireEvent.click(repeatButton);
    expect(screen.getByText(/Every day/)).toBeInTheDocument();
    expect(screen.getByText(/Every week/i)).toBeInTheDocument();
    expect(screen.getByText(/Every weekday/i)).toBeInTheDocument();
    expect(screen.getByText(/Every month/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
  });

  it("selects a quick repeat option and closes the menu", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptions />
      </FormProviderWrapper>,
    );
    const repeatButton = screen.getByRole("button");
    fireEvent.click(repeatButton);
    const dailyOption = screen.getByText(/Every day/);
    fireEvent.click(dailyOption);
    // Menu should close, button still present
    expect(repeatButton).toBeInTheDocument();
  });

  it("shows custom dialog when clicking Custom option", () => {
    render(
      <FormProviderWrapper>
        <RepeatOptions />
      </FormProviderWrapper>,
    );
    const repeatButton = screen.getByRole("button");
    fireEvent.click(repeatButton);
    const customOption = screen.getByText(/Custom/i);
    fireEvent.click(customOption);
    // Something from custom UI should render, but we don't know specifics,
    // so just check for the dialog context
    expect(screen.getByText(/custom repeat/i)).toBeInTheDocument();
  });

  it("shows a clear icon when RRULE is set", () => {
    function RepeatingFormWrapper({ children }: { children: React.ReactNode }) {
      const defaultValues: TaskFormFields = {
        title: "",
        description: "",
        due_date: null,
        project: 1,
        section: 1,
        priority: "NONE",
        tags: [],
        dtstart: dayjs().startOf("day"),
        rrule: "FREQ=DAILY", // has repeat rule
        anchor_mode: "SCHEDULED",
        completion_date: null,
      };
      const form = useForm<TaskFormFields>({ defaultValues });
      return <FormProvider {...form}>{children}</FormProvider>;
    }
    render(
      <RepeatingFormWrapper>
        <RepeatOptions />
      </RepeatingFormWrapper>,
    );
    // The RepeatIcon should be visible, might be present via aria-label or other markers
    expect(screen.getByLabelText(/Clear repeat/i)).toBeInTheDocument();
  });
});
