import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import InboxIcon from "@mui/icons-material/Inbox";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import Button, { type ButtonProps } from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { type Control, Controller } from "react-hook-form";

import ProfileContext from "../contexts/profileContext";
import type { TaskFormFields } from "../types/common";
import TaskProjectMenu from "./TaskProjectMenu";

interface ButtonLabelProps {
  selectedProject: { title: string; is_default: boolean } | undefined;
  selectedSection: { title: string; is_default: boolean } | undefined;
}
function ButtonLabel({ selectedProject, selectedSection }: ButtonLabelProps) {
  return (
    <>
      <Typography
        fontSize={"small"}
        textOverflow={"ellipsis"}
        overflow={"hidden"}
      >
        {selectedProject?.title}
      </Typography>
      {!selectedSection?.is_default && (
        <>
          <Typography>&nbsp;/&nbsp;</Typography>
          <SplitscreenIcon fontSize="small" />
          <Typography
            fontSize={"small"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            {selectedSection?.title}
          </Typography>
        </>
      )}
    </>
  );
}

interface TaskProjectButtonProps extends ButtonProps {
  control: Control<TaskFormFields>;
  sectionId: number;
  projectId: number;
  compact?: boolean;
}

export default function TaskProjectButton({
  control,
  sectionId,
  projectId,
  compact, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...buttonProps
}: TaskProjectButtonProps) {
  const profile = React.useContext(ProfileContext)!;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenuButton = (event: React.MouseEvent<HTMLElement>) => {
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
              // sx={{
              //   display: "flex", // Use flexbox for layout
              //   justifyContent: "space-between", // Space between startIcon+label and endIcon
              //   alignItems: "center", // Vertically center content
              //   flexGrow: 1, // Allow the button to grow to fill its parent
              //   maxWidth: "100%", // Prevent the button from exceeding its container
              //   overflow: "hidden", // Hide overflowing content
              //   textOverflow: "ellipsis", // Add ellipsis for overflowing text
              //   whiteSpace: "nowrap", // Prevent text from wrapping
              // }}
              sx={{
                ...buttonProps.sx,
                display: "flex",
                flexShrink: 1, // Allow the button to shrink
                maxWidth: "100%", // Prevent it from growing beyond its container
                overflow: "hidden", // Hide overflowing content
                textOverflow: "ellipsis", // Add ellipsis for overflowing text
                whiteSpace: "nowrap", // Prevent text from wrapping
                justifyContent: "start",
              }}
            >
              <ButtonLabel
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
