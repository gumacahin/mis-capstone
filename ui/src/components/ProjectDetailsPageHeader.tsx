import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { generatePath, Link as RouterLink } from "react-router-dom";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function ProjectDetailsPageHeader({
  isInbox = false,
  projectName,
}: {
  isInbox?: boolean;
  projectName: string;
}) {
  const projectsPath = generatePath("/app/projects");
  return (
    <Box p={2} sx={{ justifyContent: "end", display: "flex" }}>
      <span>test</span>
    </Box>
  );
}
