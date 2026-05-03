import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import TimeOptions from "../TimeOptions";

vi.mock("../TimeOptions", async () => {
  const actual =
    await vi.importActual<typeof import("../TimeOptions")>("../TimeOptions");
  return {
    ...actual,
    useTimezoneContext: () => "UTC",
  };
});

interface MockDtstart {
  tz: () => {
    format: (fmt: string) => string;
    startOf: () => MockDtstart;
  };
}

const setup = (defaultValues = { dtstart: null as MockDtstart | null }) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };
  render(
    <Wrapper>
      <TimeOptions />
    </Wrapper>,
  );
};

describe("TimeOptions", () => {
  it("renders with default 'Time' when no dtstart", () => {
    setup();
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("opens dialog when list item is clicked", () => {
    setup();
    const timeListItem = screen.getByRole("button");
    fireEvent.click(timeListItem);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows the time if dtstart has a non-midnight time", () => {
    const mockDtstart: MockDtstart = {
      tz: () => ({
        format: (fmt: string) => (fmt === "h:mm A" ? "2:33 PM" : ""),
        startOf: () => mockDtstart,
      }),
    };
    setup({ dtstart: mockDtstart });
    expect(screen.getByText("2:33 PM")).toBeInTheDocument();
  });

  it("shows clear button (CloseIcon) when dtstart has a time", () => {
    const mockDtstart: MockDtstart = {
      tz: () => ({
        format: (fmt: string) => (fmt === "h:mm A" ? "3:45 AM" : ""),
        startOf: () => mockDtstart,
      }),
    };
    setup({ dtstart: mockDtstart });
    expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
  });

  it("does not show clear button when dtstart is at midnight", () => {
    const mockDtstart: MockDtstart = {
      tz: () => ({
        format: (fmt: string) => (fmt === "h:mm A" ? "12:00 AM" : ""),
        startOf: () => mockDtstart,
      }),
    };
    setup({ dtstart: mockDtstart });
    expect(screen.queryByTestId("CloseIcon")).not.toBeInTheDocument();
  });

  it.skip("handles clear button click and resets time to midnight", () => {
    const setValue = vi.fn();
    vi.spyOn(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("react-hook-form"),
      "useFormContext",
    ).mockReturnValue({
      watch: () => ({
        tz: () => ({
          format: (fmt: string) => (fmt === "h:mm A" ? "2:33 PM" : ""),
          startOf: () => ({
            tz: () => ({
              format: (fmt: string) => (fmt === "h:mm A" ? "12:00 AM" : ""),
            }),
          }),
        }),
      }),
      setValue,
      formState: { isValid: true },
      register: vi.fn(),
      getValues: vi.fn(),
      control: {},
    });

    const fakeDtstart: MockDtstart = {
      tz: () => ({
        format: (fmt: string) => (fmt === "h:mm A" ? "2:33 PM" : ""),
        startOf: () => ({
          tz: () => ({
            format: (fmt: string) => (fmt === "h:mm A" ? "12:00 AM" : ""),
            startOf: () => fakeDtstart,
          }),
        }),
      }),
    };
    setup({ dtstart: fakeDtstart });

    const clearButton = screen.getByTestId("CloseIcon").parentElement!;
    fireEvent.click(clearButton);
    expect(setValue).toHaveBeenCalledWith("dtstart", expect.anything());
  });
});
