import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { ProjectDetail } from "@shared/types/common";
import { useState } from "react";

import ProjectDeleteDialog from "../components/ProjectDeleteDialog";
import ProjectEditDialog from "../components/ProjectEditDialog";
import AddProjectDialog from "./AddProjectDialog";

export default function ProjectMenu({
  anchorEl,
  project,
  handleClose,
}: {
  anchorEl: null | HTMLElement;
  project: ProjectDetail;
  handleClose: () => void;
}) {
  const [projectForEdit, setProjectForEdit] = useState<ProjectDetail | null>(
    null,
  );
  const [projectForDelete, setProjectForDelete] =
    useState<ProjectDetail | null>(null);

  const [referenceProject, setReferenceProject] =
    useState<ProjectDetail | null>(null);

  const [position, setPosition] = useState<"above" | "below" | null>(null);

  const handleAddProject = (
    e: React.MouseEvent<HTMLElement>,
    project: ProjectDetail,
    position: "above" | "below",
  ) => {
    e.stopPropagation();
    setReferenceProject(project);
    setPosition(position);
    handleClose();
  };

  const handleCloseAddProjectDialog = () => {
    setReferenceProject(null);
    setPosition(null);
  };

  const canAddProject = referenceProject !== null && position !== null;

  return (
    <>
      {canAddProject && (
        <AddProjectDialog
          open={canAddProject}
          handleClose={handleCloseAddProjectDialog}
          referenceProjectId={referenceProject.id}
          position={position}
        />
      )}
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
            handleAddProject(e, project, "above");
          }}
        >
          <ListItemIcon>
            <VerticalAlignTopIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add project above" />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleAddProject(e, project, "below");
          }}
        >
          <ListItemIcon>
            <VerticalAlignBottomIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add project below" />
        </MenuItem>
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
          sx={{ color: (theme) => theme.palette.error.main }}
        >
          <ListItemIcon
            sx={{
              color: (theme) => theme.palette.error.main,
            }}
          >
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
}
