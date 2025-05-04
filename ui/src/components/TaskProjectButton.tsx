import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InboxIcon from "@mui/icons-material/Inbox";
import TagIcon from "@mui/icons-material/Tag";
import Button, { type ButtonProps } from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { type MouseEvent, useContext, useState } from "react";
import { type Control, Controller } from "react-hook-form";

import ProfileContext from "../contexts/profileContext";
import type { TaskFormFields } from "../types/common";
import TaskProjectButtonLabel from "./TaskProjectButtonLabel";
import TaskProjectMenu from "./TaskProjectMenu";

interface TaskProjectButtonProps extends ButtonProps {
  control: Control<TaskFormFields>;
  sectionId: number;
  projectId: number;
}

export default function TaskProjectButton({
  control,
  sectionId,
  projectId,
  ...buttonProps
}: TaskProjectButtonProps) {
  const profile = useContext(ProfileContext)!;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenuButton = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const inbox = profile.projects.find((p) => p.is_default);
  const inboxDefaultSection = inbox?.sections.find((s) => s.is_default);
  const projects = profile.projects.filter((p) => !p.is_default);
  const allSections = profile.projects.reduce(
    (acc, project) => {
      acc = [...acc, ...project.sections];
      return acc;
    },
    [] as { title: string; id: number; is_default: boolean; project: number }[],
  );
  const selectedSection = allSections.find((s) => s.id === sectionId);
  const defaultProjectSection = allSections.find(
    (s) => s.is_default && s.project == projectId,
  );
  const defaultOrSelectedSection = selectedSection ?? defaultProjectSection;

  const selectedProject = profile.projects.find((p) =>
    p.sections.some((s) => s.id === defaultOrSelectedSection?.id),
  );

  return (
    <Controller
      name="section"
      control={control}
      defaultValue={sectionId}
      render={({ field }) => (
        <>
          <Tooltip title="Select a project">
            <Button
              {...buttonProps}
              id="task-project-button"
              aria-haspopup="listbox"
              aria-controls="task-project-menu"
              aria-label="task-project-button"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClickMenuButton}
              size="small"
              startIcon={
                selectedProject?.is_default ? (
                  <InboxIcon fontSize="small" />
                ) : (
                  <TagIcon fontSize="small" />
                )
              }
              endIcon={<ArrowDropDownIcon />}
              sx={{
                ...buttonProps.sx,
                display: "flex",
                flexShrink: 1,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                justifyContent: "start",
              }}
            >
              <TaskProjectButtonLabel
                selectedProject={selectedProject}
                selectedSection={selectedSection}
              />
            </Button>
          </Tooltip>
          <TaskProjectMenu
            field={field}
            inbox={inbox}
            projects={projects}
            inboxDefaultSection={inboxDefaultSection}
            sectionId={sectionId}
            anchorEl={anchorEl}
            handleClose={handleClose}
          />
        </>
      )}
    />
  );
}
