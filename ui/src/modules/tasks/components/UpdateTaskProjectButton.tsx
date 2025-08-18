import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import InboxIcon from "@mui/icons-material/Inbox";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ProfileContext from "@shared/contexts/profileContext";
import { useUpdateTask } from "@shared/hooks/queries";
import type { TaskFormFields } from "@shared/types/common";
import { Task } from "@shared/types/common";
import { Fragment, type MouseEvent, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import TaskProjectButtonLabel from "./TaskProjectButtonLabel";

export default function UpdateTaskProjectButton({ task }: { task: Task }) {
  const { mutateAsync: updateTask } = useUpdateTask(task);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const selectedSection = allSections.find((s) => s.id === task.section);
  const defaultProjectSection = allSections.find(
    (s) => s.is_default && s.project == task.project,
  );
  const defaultOrSelectedSection = selectedSection ?? defaultProjectSection;

  const selectedProject = profile.projects.find((p) =>
    p.sections.some((s) => s.id === defaultOrSelectedSection?.id),
  );

  const defaultValues = {
    section: defaultOrSelectedSection?.id,
  };

  const { control, handleSubmit } = useForm<TaskFormFields>({
    defaultValues,
  });

  const onSubmit = async (data: TaskFormFields) => {
    setIsSubmitting(true);
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
    setIsSubmitting(false);
  };

  const taskIsCompleted = task.completion_date != null;

  return (
    <Controller
      name="section"
      control={control}
      defaultValue={task.section}
      render={({ field }) => (
        <>
          <Tooltip title="Select a project">
            <Button
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
                display: "flex",
                flexShrink: 1,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                justifyContent: "start",
              }}
              disabled={isSubmitting || taskIsCompleted}
            >
              <TaskProjectButtonLabel
                selectedProject={selectedProject}
                selectedSection={selectedSection}
              />
            </Button>
          </Tooltip>
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
                <Fragment key={project.id}>
                  <MenuItem
                    key={project.id}
                    selected={defaultSectionId === task.section}
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
                </Fragment>
              );
            })}
          </Menu>
        </>
      )}
    />
  );
}
