import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TagIcon from "@mui/icons-material/Tag";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { type Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Extension } from "@tiptap/core";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BubbleMenu, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import dayjs from "dayjs";
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButton,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  type MenuButtonEditLinkProps,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  RichTextContent,
  RichTextEditorProvider,
  useRichTextEditorContext,
} from "mui-tiptap";
import { Plugin, PluginKey } from "prosemirror-state";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useUpdateTask } from "../api";
import useSectionContext from "../hooks/useSectionContext";
import type { ProjectDetail, Task, TaskFormFields } from "../types/common";
import CommentList from "./CommentList";
import DatePicker from "./DatePicker";
import TaskCheckIcon from "./TaskCheckIcon";
import TaskPriorityMenu from "./TaskPriorityMenu";
import TaskProjectMenuButton from "./TaskProjectButton";
import UpdateTaskProjectButton from "./UpdateTaskProjectButton";
import UpdateTaskTags from "./UpdateTaskTags";

function MenuButtonEditLink(props: MenuButtonEditLinkProps) {
  // This is taken from https://github.com/sjdemartini/mui-tiptap/blob/main/src/controls/MenuButtonEditLink.tsx
  // Instead of using a ref to the menu button we use the editor view dom as the
  // anchor instead. This prevents the LinkBubbleMenu from being positioned incorrectly
  // when the bubble menu closes as the user interacts with the LinkBubbleMenu.
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={LinkIcon}
      selected={editor?.isActive("link")}
      disabled={!editor?.isEditable}
      onClick={() =>
        editor?.commands.openLinkBubbleMenu({
          anchorEl: editor?.view.dom,
          placement: "bottom",
        })
      }
      {...props}
    />
  );
}

// @link https://github.com/ueberdosis/tiptap/issues/313#issuecomment-1277897635
const NoNewLine = Extension.create({
  name: "no_new_line",

  addOptions() {
    return {
      onEnter: () => undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          handleKeyDown: (_, event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              this.options.onEnter();
              return true;
            }
          },
        },
      }),
    ];
  },
});

export default function UpdateTaskDialog({
  open,
  handleClose,
  task,
  project,
}: {
  open: boolean;
  handleClose: () => void;
  task: Task;
  project: ProjectDetail;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const titleFieldStyles = {
    "& .tiptap.ProseMirror p ": {
      fontWeight: (theme) => {
        return theme.typography.fontWeightMedium;
      },
    },
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formActive, setFormActive] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(task.due_date != null);
  const updateTask = useUpdateTask(task);
  const defaultValues = {
    title: task.title,
    description: task.description,
  };
  const { control, handleSubmit, watch, formState } = useForm<TaskFormFields>({
    defaultValues,
  });

  const { field: titleField } = useController({
    control,
    name: "title",
    rules: {
      required: true,
      validate: (value) => value.replace(/^(<p>)+|(<\/p>)+$/gi, "").length > 0,
    },
  });
  const { field: descriptionField } = useController({
    control,
    name: "description",
  });
  const section = useSectionContext();
  const taskMenuOpen = Boolean(anchorEl);

  const onSubmit: SubmitHandler<TaskFormFields> = async (data) => {
    console.log("onSubmit", data);
    try {
      await toast.promise(updateTask.mutateAsync(data), {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Error updating task.",
      });
    } catch (error) {
      console.error("Error updating task", error);
    } finally {
      setFormActive(false);
    }
  };

  const titleEditor = useEditor({
    extensions: [
      StarterKit,
      LinkBubbleMenuHandler,
      Link,
      NoNewLine.configure({ onEnter: handleSubmit(onSubmit) }),
      Placeholder.configure({ placeholder: "Task name" }),
    ],
    content: titleField.value,
    onUpdate: ({ editor }) => {
      titleField.onChange(editor.getHTML());
    },
  });

  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      LinkBubbleMenuHandler,
      Link,
      Placeholder.configure({ placeholder: "Description" }),
    ],
    content: descriptionField.value,
    onUpdate: ({ editor }) => {
      descriptionField.onChange(editor.getHTML());
    },
  });

  const sectionId = watch("section");
  const dueDate = watch("due_date");
  const priority = watch("priority");
  const tags = watch("tags");

  // FIXME: Too clunky. Revisit this when you get the chance.
  useEffect(() => {
    setShowDatePicker(dueDate != null);
  }, [dueDate]);
  const handleCloseDatePicker = () => {
    if (!dueDate) {
      setShowDatePicker(false);
    }
    setShowDatePicker(true);
  };

  const handleOpenTaskMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseTaskMenu = () => {
    setAnchorEl(null);
  };

  const handleNextTask = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };
  const handlePreviousTask = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleDuplicateMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };
  const handleCopyMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };
  const handleDeleteMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleCloseTaskMenu();
  };

  const taskIsCompleted = task.completion_date != null;

  return (
    <>
      <Dialog
        open={open}
        slotProps={{
          paper: {
            sx: {
              height: "80vh",
              minWidth: { xs: "100vw", sm: "600px", md: "800px" },
            },
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row">
              <Button size="small" startIcon={<TagIcon fontSize="small" />}>
                {project.title}
              </Button>
              {!section.is_default && (
                <>
                  {" "}
                  /{" "}
                  <Button
                    size="small"
                    startIcon={<SplitscreenIcon fontSize="small" />}
                  >
                    {section.title}
                  </Button>
                </>
              )}
            </Stack>
            <Stack direction="row">
              <IconButton size="small" onClick={handlePreviousTask}>
                <ExpandLessIcon />
              </IconButton>
              <IconButton size="small" onClick={handleNextTask}>
                <ExpandMoreIcon />
              </IconButton>
              <IconButton size="small" onClick={handleOpenTaskMenu}>
                <MoreHorizIcon />
              </IconButton>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 0 }}>
          <Grid container spacing={1} sx={{ height: "100%" }}>
            <Grid size={{ xs: 12, md: 8 }} padding={2}>
              <Box display="flex" flexDirection="row">
                <Box>
                  <TaskCheckIcon disabled={formActive} task={task} />
                </Box>
                <Box flexGrow={1}>
                  {!formActive && (
                    <Stack
                      sx={[taskIsCompleted && { cursor: "not-allowed" }]}
                      spacing={1}
                      onClick={() => {
                        if (!task.completion_date) {
                          setFormActive(true);
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          textDecoration: task.completion_date
                            ? "line-through"
                            : "default",
                          paddingTop: "8px",
                        }}
                      >
                        {task.title}
                      </Typography>
                      {!task.completion_date && task.description && (
                        <Typography>{task.description}</Typography>
                      )}
                      {!task.completion_date && !task.description && (
                        <Box display="flex" alignItems={"center"}>
                          <DescriptionIcon />
                          <Typography color="GrayText">Description</Typography>
                        </Box>
                      )}
                    </Stack>
                  )}
                  {formActive && (
                    <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
                      <Stack
                        spacing={0}
                        sx={{
                          border: "2px solid",
                          borderColor: "primary.main",
                          borderRadius: (theme) => theme.spacing(0.5),
                        }}
                      >
                        <Box p={1}>
                          <RichTextEditorProvider editor={titleEditor}>
                            {titleEditor && (
                              <BubbleMenu editor={titleEditor}>
                                <Paper
                                  onMouseDown={(event) =>
                                    event.stopPropagation()
                                  }
                                >
                                  <MenuControlsContainer>
                                    <MenuButtonBold />
                                    <MenuButtonItalic />
                                    <MenuButtonStrikethrough />
                                    <MenuButtonCode />
                                    <MenuDivider />
                                    <MenuButtonEditLink />
                                  </MenuControlsContainer>
                                </Paper>
                              </BubbleMenu>
                            )}
                            <Box sx={titleFieldStyles}>
                              <RichTextContent />
                            </Box>
                            <LinkBubbleMenu />
                          </RichTextEditorProvider>
                        </Box>
                        <Stack p={1} direction="row" width={"100%"}>
                          <DescriptionIcon
                            isVisible={descriptionEditor?.isEmpty}
                          />
                          <Box flexGrow={1}>
                            <RichTextEditorProvider editor={descriptionEditor}>
                              {descriptionEditor && (
                                <BubbleMenu editor={descriptionEditor}>
                                  <Paper
                                    onMouseDown={(event) =>
                                      event.stopPropagation()
                                    }
                                  >
                                    <MenuControlsContainer>
                                      <MenuButtonBold />
                                      <MenuButtonItalic />
                                      <MenuButtonStrikethrough />
                                      <HeadingMenuButtons />
                                      <MenuButtonBlockquote />
                                      <MenuButtonCode />
                                      <MenuButtonBulletedList />
                                      <MenuButtonOrderedList />
                                      <MenuDivider />
                                      <MenuButtonEditLink />
                                    </MenuControlsContainer>
                                  </Paper>
                                </BubbleMenu>
                              )}
                              <RichTextContent />
                              <LinkBubbleMenu />
                            </RichTextEditorProvider>
                          </Box>
                        </Stack>
                      </Stack>
                      <Stack
                        py={2}
                        direction="row"
                        spacing={1}
                        justifyContent={"flex-end"}
                      >
                        <Button
                          onClick={() => {
                            setFormActive(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button disabled={!formState.isValid} type="submit">
                          Save Task
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                  {/* <CommentList task={task} /> */}
                  {/* <AddCommentForm task={data} userDisplayName={userDisplayName} /> */}
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={[
                {
                  minHeight: "100%",
                  backgroundColor: (theme: Theme) =>
                    theme.palette.background.paper,
                  padding: 2,
                },
                taskIsCompleted && { cursor: "not-allowed" },
              ]}
            >
              <Typography
                variant="subtitle2"
                sx={[
                  taskIsCompleted && {
                    color: (theme) => theme.palette.text.disabled,
                  },
                ]}
              >
                Project
              </Typography>
              <UpdateTaskProjectButton task={task} />
              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Tooltip title="Change due date">
                  <Button
                    variant="text"
                    size="small"
                    fullWidth
                    sx={{
                      justifyContent: "space-between",
                      textTransform: "none",
                    }}
                    color="inherit"
                    disabled={taskIsCompleted}
                    onClick={() => {
                      setShowDatePicker(true);
                      setTimeout(() => ref.current?.click(), 0);
                    }}
                    endIcon={!dueDate && <AddIcon fontSize="small" />}
                  >
                    <Typography variant="subtitle2">Due Date</Typography>
                  </Button>
                </Tooltip>
              </Stack>
              {/* {showDatePicker && (
                <DatePicker
                  onClose={handleCloseDatePicker}
                  disabled={taskIsCompleted}
                  control={control}
                  ref={ref}
                  variant="text"
                  fullWidth
                />
              )} */}
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle2"
                sx={[
                  taskIsCompleted && {
                    color: (theme) => theme.palette.grey[500],
                  },
                ]}
              >
                Priority
              </Typography>
              {/* <TaskPriorityMenu
                disabled={taskIsCompleted}
                priority={priority}
                fullWidth
                variant="text"
                control={control}
                sx={{
                  ".MuiButton-endIcon": { flexGrow: 1, justifyContent: "end" },
                }}
              /> */}
              <Divider sx={{ my: 1 }} />
              {/* <UpdateTaskTags
                tags={tags}
                control={control}
                disabled={taskIsCompleted}
              /> */}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Menu
        sx={{ width: 320 }}
        anchorEl={anchorEl}
        id="task-menu"
        open={taskMenuOpen}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleDuplicateMenuItemClick}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleCopyMenuItemClick}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Copy Link to Task
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteMenuItemClick}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

function DescriptionIcon({ isVisible = true }: { isVisible?: boolean }) {
  return (
    <Box
      color="GrayText"
      mr={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        width: "16px",
        height: "16px",
        display: isVisible ? "block" : "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M8.5 12a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1h5Zm3.864-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 9H3.636C3.285 9 3 8.777 3 8.5c0-.245.225-.45.522-.491L3.636 8h8.728Zm0-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 5H3.636C3.285 5 3 4.777 3 4.5c0-.245.225-.45.522-.491L3.636 4h8.728Z"
        ></path>
      </svg>
    </Box>
  );
}

function HeadingMenuButtons() {
  const editor = useRichTextEditorContext();
  return (
    <>
      <MenuButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        tooltipLabel="Heading 1"
        tooltipShortcutKeys={["mod", "alt", "1"]}
        selected={editor?.isActive("heading", { level: 1 }) ?? false}
        disabled={!editor?.isEditable || !editor.can().toggleBold()}
      >
        H1
      </MenuButton>
      <MenuButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        tooltipLabel="Heading 2"
        tooltipShortcutKeys={["mod", "alt", "2"]}
        selected={editor?.isActive("heading", { level: 2 }) ?? false}
        disabled={!editor?.isEditable || !editor.can().toggleBold()}
      >
        H2
      </MenuButton>
    </>
  );
}
