import CheckIcon from "@mui/icons-material/Check";
import InboxIcon from "@mui/icons-material/Inbox";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { ControllerRenderProps } from "react-hook-form";

import type { ProfileProject, TaskFormFields } from "../types/common";

export interface TaskProjectMenuProps {
  handleClose: () => void;
  sectionId: number;
  inbox?: ProfileProject;
  projects?: ProfileProject[];
  inboxDefaultSection?: ProfileProject["sections"][number];
  anchorEl: null | HTMLElement;
  field: ControllerRenderProps<TaskFormFields, "section">;
}
export default function TaskProjectMenu({
  field,
  inbox,
  projects,
  inboxDefaultSection,
  sectionId,
  anchorEl,
  handleClose,
}: TaskProjectMenuProps) {
  return (
    <Menu
      id="task-project-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
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
                inboxDefaultSection?.id === sectionId ? "visible" : "hidden",
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
                  visibility: section.id === sectionId ? "visible" : "hidden",
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
      {projects?.map((project) => {
        const defaultSectionId = project.sections.find((s) => s.is_default)!.id;
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
                      defaultSectionId === sectionId ? "visible" : "hidden",
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
  );
}
