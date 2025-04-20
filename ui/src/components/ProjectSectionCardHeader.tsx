import DuplicateIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoveIcon from "@mui/icons-material/LowPriority";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MouseEvent, useContext, useState } from "react";
import { toast } from "react-hot-toast";

import { useDuplicateSection } from "../api";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import { ProjectDetail, Section } from "../types/common";
import ProjectSectionDeleteDialog from "./ProjectSectionDeleteDialog";
import ProjectSectionEditDialog from "./ProjectSectionEditDialog";
import ProjectSectionMoveMenu from "./ProjectSectionMoveMenu";

export default function ProjectSectionCardHeader() {
  const section = useContext<Section | null>(SectionContext)!;
  const project = useContext<ProjectDetail | null>(ProjectContext)!;
  const [sectionForEdit, setSectionForEdit] = useState<Section | null>(null);
  const [sectionForDelete, setSectionForDelete] = useState<Section | null>(
    null,
  );
  const { mutateAsync: duplicateSection } = useDuplicateSection(
    section.id,
    project.id,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [moveMenuAnchorEl, setMoveMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenSectionMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSectionMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMoveMenu = (event: MouseEvent<HTMLLIElement>) => {
    setMoveMenuAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleCloseMoveMenu = () => {
    setMoveMenuAnchorEl(null);
  };

  const handleDuplicateSection = async () => {
    handleCloseSectionMenu();
    handleCloseMoveMenu();
    await toast.promise(duplicateSection(), {
      loading: "Duplicating ...",
      success: "Section duplicated successfully!",
      error: "Failed to duplicate section.",
    });
  };

  if (!section || !project) {
    return null;
  }

  return (
    <>
      <ProjectSectionMoveMenu
        anchorEl={moveMenuAnchorEl}
        currentProjectId={section.project}
        sectionId={section.id}
        handleClose={handleCloseMoveMenu}
        handleCloseParentMenu={handleCloseSectionMenu}
      />
      {sectionForDelete && (
        <ProjectSectionDeleteDialog
          open={!!sectionForDelete}
          section={sectionForDelete}
          handleClose={() => setSectionForDelete(null)}
        />
      )}
      {sectionForEdit && (
        <ProjectSectionEditDialog
          open={!!sectionForEdit}
          section={sectionForEdit}
          handleClose={() => setSectionForEdit(null)}
        />
      )}
      <Menu
        id="section-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseSectionMenu}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setSectionForEdit(section);
            handleCloseSectionMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={handleOpenMoveMenu}>
          <ListItemIcon>
            <MoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Move to..." />
        </MenuItem>
        <MenuItem onClick={handleDuplicateSection}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Duplicate" />
        </MenuItem>
        <Divider component="li" aria-hidden={true} />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setSectionForDelete(section);
            handleCloseSectionMenu();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
      <CardHeader
        sx={{ "MuiCardHeader-root": { padding: 0 } }}
        title={
          <Stack
            direction={"row"}
            spacing={1}
            alignItems="center"
            maxWidth="100%"
            width="100%"
            overflow={"hidden"}
          >
            <Typography
              sx={{
                flexShrink: 1,
                textWrap: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              fontWeight={500}
              fontSize={16}
            >
              {section.is_default ? "(No Section)" : section.title}
            </Typography>
            <Typography
              sx={{
                flexShrink: 0,
                textWrap: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {section.tasks.length}
            </Typography>
          </Stack>
        }
        action={
          <IconButton
            onClick={handleOpenSectionMenu}
            // edge="end"
            aria-label="comments"
            sx={{ visibility: section.is_default ? "hidden" : "visible" }}
          >
            <MoreHorizIcon />
          </IconButton>
        }
      />
    </>
  );
}
