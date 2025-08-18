import CheckIcon from "@mui/icons-material/Check";
import InboxIcon from "@mui/icons-material/Inbox";
import MoveIcon from "@mui/icons-material/LowPriority";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ProfileContext from "@shared/contexts/profileContext";
import { useUpdateTask } from "@shared/hooks/queries";
import type { TaskFormFields } from "@shared/types/common";
import { Task } from "@shared/types/common";
import { type MouseEvent, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface TaskMoveMenuItemProps {
  task: Task;
  onClose: () => void;
}
export default function TaskMoveMenuItem({
  task,
  onClose,
}: TaskMoveMenuItemProps) {
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const profile = useContext(ProfileContext)!;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClickMenuItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    onClose();
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
  const selectedSection = allSections.find((s) => s.id === task.section);
  const defaultProjectSection = allSections.find(
    (s) => s.is_default && s.project == task.project,
  );
  const defaultOrSelectedSection = selectedSection ?? defaultProjectSection;

  const defaultValues = {
    section: defaultOrSelectedSection?.id,
  };

  const { control, handleSubmit } = useForm<TaskFormFields>({
    defaultValues,
  });

  const onSubmit = async (data: TaskFormFields) => {
    await toast.promise(
      updateTask({
        section: data.section,
      }),
      {
        loading: "Reorganizing task...",
        success: "Task reorganized successfully!",
        error: "Failed to reorganize task.",
      },
    );
  };

  return (
    <Controller
      name="section"
      control={control}
      defaultValue={task.section}
      render={({ field }) => (
        <>
          <MenuItem onClick={handleClickMenuItem} id="task-project-menu-item">
            <ListItemIcon>
              <MoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Move to…" />
          </MenuItem>
          <Menu
            id="task-project-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "task-project-menu-item",
                role: "listbox",
              },
            }}
          >
            <MenuItem
              key={inboxDefaultSection?.id}
              component={ListItem}
              selected={inboxDefaultSection?.id === task.section}
              onClick={() => {
                field.onChange(inboxDefaultSection?.id);
                handleSubmit(onSubmit)();
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
                      inboxDefaultSection?.id === task.section
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
                  selected={section.id === task.section}
                  disabled={section.id === task.section}
                  onClick={() => {
                    field.onChange(section.id);
                    handleSubmit(onSubmit)();
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
                          section.id === task.section ? "visible" : "hidden",
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
              const defaultSectionId = project.sections.find(
                (s) => s.is_default,
              )!.id;
              return (
                <>
                  <MenuItem
                    key={project.id}
                    selected={defaultSectionId === task.section}
                    disabled={defaultSectionId === task.section}
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
                            defaultSectionId === task.section
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
                        key={`project-${project.id}--section-${section.id}`}
                        selected={section.id === task.section}
                        disabled={section.id === task.section}
                        onClick={() => {
                          field.onChange(section.id);
                          handleSubmit(onSubmit)();
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
                                section.id === task.section
                                  ? "visible"
                                  : "hidden",
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
