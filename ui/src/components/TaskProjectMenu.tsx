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
import type { ITaskFormFields } from "../types/common";

interface IButtonLabelProps {
  selectedProject: { title: string; is_default: boolean } | undefined;
  selectedSection: { title: string; is_default: boolean } | undefined;
}
function ButtonLabel({ selectedProject, selectedSection }: IButtonLabelProps) {
  console.log("selectedProject", selectedProject);
  console.log("selectedSection", selectedSection);
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

interface ITaskProjectMenuProps extends ButtonProps {
  control: Control<ITaskFormFields>;
  sectionId: number;
  projectId: number;
  compact?: boolean;
}

export default function TaskProjectMenu({
  control,
  sectionId,
  projectId,
  compact, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...buttonProps
}: ITaskProjectMenuProps) {
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
          <Menu
            id="task-project-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "task-project-button",
              role: "listbox",
            }}
          >
            <MenuItem
              component={ListItem}
              selected={inboxDefaultSection?.id === sectionId}
              onClick={() => {
                field.onChange(inboxDefaultSection?.id);
                handleClose();
              }}
            >
              <ListItemIcon>
                <InboxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{inbox?.title}</ListItemText>
              <ListItemIcon>
                <CheckIcon
                  fontSize="small"
                  sx={{
                    visibility:
                      inboxDefaultSection?.id === sectionId
                        ? "visible"
                        : "hidden",
                  }}
                />
              </ListItemIcon>
            </MenuItem>
            {inbox?.sections
              .filter((s) => !s.is_default)
              .map((section) => (
                <MenuItem
                  sx={{ pl: 4 }}
                  key={section.id}
                  selected={section.id === sectionId}
                  onClick={() => {
                    field.onChange(section.id);
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <SplitscreenIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{section.title}</ListItemText>
                  <ListItemIcon>
                    <CheckIcon
                      fontSize="small"
                      sx={{
                        visibility:
                          section.id === sectionId ? "visible" : "hidden",
                      }}
                    />
                  </ListItemIcon>
                </MenuItem>
              ))}
            <MenuItem disabled>
              <ListItemText>
                <Typography fontWeight={"bold"}>My Projects</Typography>
              </ListItemText>
            </MenuItem>
            {projects.map((project) => {
              const defaultSectionId = project.sections.find(
                (s) => s.is_default,
              )!.id;
              return (
                <>
                  <MenuItem
                    key={project.id}
                    selected={defaultSectionId === sectionId}
                    onClick={() => {
                      field.onChange(defaultSectionId);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <TagIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{project.title}</ListItemText>
                    <ListItemIcon>
                      <CheckIcon
                        fontSize="small"
                        sx={{
                          visibility:
                            defaultSectionId === sectionId
                              ? "visible"
                              : "hidden",
                        }}
                      />
                    </ListItemIcon>
                  </MenuItem>
                  {project.sections
                    .filter((s) => !s.is_default)
                    .map((section) => (
                      <MenuItem
                        component={ListItem}
                        sx={{ pl: 4 }}
                        key={section.id}
                        selected={section.id === sectionId}
                        onClick={() => {
                          field.onChange(section.id);
                          handleClose();
                        }}
                      >
                        <ListItemIcon>
                          <SplitscreenIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{section.title}</ListItemText>
                        <ListItemIcon>
                          <CheckIcon
                            fontSize="small"
                            sx={{
                              visibility:
                                section.id === sectionId ? "visible" : "hidden",
                            }}
                          />
                        </ListItemIcon>
                      </MenuItem>
                    ))}
                </>
              );
            })}
          </Menu>
        </>
      )}
    />
  );
}
