import type { ProjectDetail } from "@shared";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";

import ProjectMenu from "../ProjectMenu";

const fakeProject: ProjectDetail = {
  id: 123,
  title: "My Project",
  view: "list",
  sections: [],
};

describe("ProjectMenu", () => {
  test("Renders withou crashing", async () => {
    render(
      <ProjectMenu
        project={fakeProject}
        handleClose={() => {}}
        anchorEl={null}
      />,
    );
  });
});
