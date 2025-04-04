import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import type { Task } from "../types/common";

export interface TaskMenuProps {
  taskMenuAnchorEl: null | HTMLElement;
  task: Task;
  handleAddTaskAbove: () => void;
  handleAddTaskBelow: () => void;
  handleCloseTaskMenu: () => void;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
}

export default function TaskMenu({
  taskMenuAnchorEl,
  task,
  handleAddTaskAbove,
  handleAddTaskBelow,
  handleCloseTaskMenu,
  handleEditTask,
  handleDeleteTask,
}: TaskMenuProps) {
  // const [projectForEdit, setProjectForEdit] = useState<ITask | undefined>(
  //   undefined,
  // );
  // const [projectForDelete, setProjectForDelete] = useState<ITask | undefined>(
  //   undefined,
  // );

  // const handleCloseAddTaskForm = () => {
  //   setProjectForEdit(undefined);
  //   setPosition(null);
  // };

  // const canAddProject = referenceProject !== null && position !== null;

  return (
    <>
      <Menu
        id="task-menu"
        anchorEl={taskMenuAnchorEl}
        open={Boolean(taskMenuAnchorEl)}
        onClose={handleCloseTaskMenu}
        MenuListProps={{
          "aria-labelledby": `task-options-button-${task.id}`,
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleAddTaskAbove();
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <VerticalAlignTopIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add task above" />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleAddTaskBelow();
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <VerticalAlignBottomIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add task below" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEditTask(task);
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task);
            handleCloseTaskMenu();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
}
