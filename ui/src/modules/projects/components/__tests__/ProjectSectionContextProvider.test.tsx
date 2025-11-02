import SectionContext from "@shared/contexts/sectionContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ProjectSectionContextProvider } from "../ProjectSectionContextProvider";

describe("ProjectSectionContextProvider", () => {
  test("provides section context to children", () => {
    const fakeSection = {
      id: 123,
      title: "Test Section",
      order: 1,
      project: 5,
    };
    function ConsumerComponent() {
      return (
        <SectionContext.Consumer>
          {(section) => (
            <div data-testid="section-title">
              {section ? section.title : "no section"}
            </div>
          )}
        </SectionContext.Consumer>
      );
    }

    render(
      <ProjectSectionContextProvider section={fakeSection}>
        <ConsumerComponent />
      </ProjectSectionContextProvider>,
    );

    expect(screen.getByTestId("section-title")).toHaveTextContent(
      fakeSection.title,
    );
  });
});
