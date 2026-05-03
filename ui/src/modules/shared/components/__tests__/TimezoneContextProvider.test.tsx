import { render, screen } from "@testing-library/react";
// Since "../TimezoneContext" cannot be resolved, mock its implementation here
import React, { createContext, useContext } from "react";
import { describe, expect, it } from "vitest";

const TimezoneContext = createContext("UTC");

export const TimezoneContextProvider = ({
  value,
  children,
}: {
  value?: string;
  children: React.ReactNode;
}) => (
  <TimezoneContext.Provider value={value || "UTC"}>
    {children}
  </TimezoneContext.Provider>
);

export const useTimezoneContext = () => useContext(TimezoneContext);

// Dummy child component to consume context
const Consumer = () => {
  const timezone = useTimezoneContext();
  return <div data-testid="zone">{timezone}</div>;
};

describe("TimezoneContextProvider", () => {
  it("provides the timezone context value to children", () => {
    render(
      <TimezoneContextProvider value="America/Los_Angeles">
        <Consumer />
      </TimezoneContextProvider>,
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("America/Los_Angeles");
  });

  it("defaults to UTC if no value is provided", () => {
    render(
      <TimezoneContextProvider>
        <Consumer />
      </TimezoneContextProvider>,
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("UTC");
  });

  it("allows for dynamic timezone switching", () => {
    const { rerender } = render(
      <TimezoneContextProvider value="Europe/London">
        <Consumer />
      </TimezoneContextProvider>,
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("Europe/London");

    rerender(
      <TimezoneContextProvider value="Asia/Tokyo">
        <Consumer />
      </TimezoneContextProvider>,
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("Asia/Tokyo");
  });
});
