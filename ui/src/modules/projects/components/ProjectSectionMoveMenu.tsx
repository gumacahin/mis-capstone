import CheckIcon from "@mui/icons-material/Check";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import TagIcon from "@mui/icons-material/Tag";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMoveSection } from "@shared/hooks/queries";
import useProfileContext from "@shared/hooks/useProfileContext";
import { useState } from "react";
import { toast } from "react-hot-toast";

export interface ProjectSectionProjectSelectionMenuProps {
  sectionId: number;
  currentProjectId: number;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  handleCloseParentMenu: () => void;
}
export default function ProjectSectionMoveMenu({
  currentProjectId,
  sectionId,
  handleClose,
  handleCloseParentMenu,
  anchorEl,
}: ProjectSectionProjectSelectionMenuProps) {
  const { mutateAsync: moveSection } = useMoveSection(
    sectionId,
    currentProjectId,
  );
  const profile = useProfileContext();
  const [search, setSearch] = useState("");
  const inbox = profile.projects.filter((p) => p.is_default)[0];
  const projects = profile.projects.filter(
    (p) => !p.is_default && p.title.includes(search),
  );
  const hasProjects = projects.length > 0;

  const handleMove = async (projectId: number) => {
    handleClose();
    handleCloseParentMenu();
    await toast.promise(moveSection(projectId), {
      loading: "Moving ...",
      success: "Section moved successfully!",
      error: "Error moving section.",
    });
  };

  return (
    <Menu
      id="section-project-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "section-move-menu-item",
        role: "listbox",
      }}
    >
      <MenuItem>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          id="section-project-menu-search"
          aria-label="Search"
          placeholder="Type a project name"
          onKeyDown={(event) => {
            // Prevent menu items from getting focused when typing.
            event.stopPropagation();
          }}
        />
      </MenuItem>
      <MenuItem
        selected={currentProjectId === inbox.id}
        onClick={() => handleMove(inbox.id)}
      >
        <ListItemIcon>
          <InboxIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{inbox?.title}</ListItemText>
        <ListItemIcon>
          <CheckIcon
            fontSize="small"
            sx={{
              visibility: currentProjectId === inbox.id ? "visible" : "hidden",
            }}
          />
        </ListItemIcon>
      </MenuItem>
      {hasProjects && (
        <MenuItem disabled>
          <ListItemText>
            <Typography fontWeight={"bold"}>My Projects</Typography>
          </ListItemText>
        </MenuItem>
      )}
      {projects.map((project) => (
        <MenuItem
          key={project.id}
          selected={currentProjectId === project.id}
          onClick={() => handleMove(project.id)}
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
                  currentProjectId === project.id ? "visible" : "hidden",
              }}
            />
          </ListItemIcon>
        </MenuItem>
      ))}
    </Menu>
  );
}
