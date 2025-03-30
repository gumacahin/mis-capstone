import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

import ProjectDeleteDialog from "../components/ProjectDeleteDialog";
import ProjectEditDialog from "../components/ProjectEditDialog";
import type { IProjectOption } from "../types/common";

export default function ProjectMenu({
  anchorEl,
  project,
  handleClose,
}: {
  anchorEl: null | HTMLElement;
  project: IProjectOption;
  handleClose: () => void;
}) {
  const [projectForEdit, setProjectForEdit] = useState<IProjectOption | null>(
    null,
  );
  const [projectForDelete, setProjectForDelete] =
    useState<IProjectOption | null>(null);
  return (
    <>
      {projectForDelete && (
        <ProjectDeleteDialog
          open={!!projectForDelete}
          project={projectForDelete}
          handleClose={() => setProjectForDelete(null)}
        />
      )}
      {projectForEdit && (
        <ProjectEditDialog
          open={!!projectForEdit}
          project={projectForEdit}
          handleClose={() => setProjectForEdit(null)}
        />
      )}
      <Menu
        id="project-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `project-options-button-${project.id}`,
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setProjectForEdit(project);
            handleClose();
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
            setProjectForDelete(project);
            handleClose();
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
