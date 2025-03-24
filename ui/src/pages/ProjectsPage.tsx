import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Textfield from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProjects } from "../api";
import AddProjectButton from "../components/AddProjectButton";
import PageLayout from "../components/PageLayout";
import ProjectDeleteDialog from "../components/ProjectDeleteDialog";
import ProjectEditDialog from "../components/ProjectEditDialog";
import SkeletonList from "../components/SkeletonList";
import type { IProject } from "../types/common";

export default function ProjectsPage() {
  const { isPending, isError, data } = useProjects();

  const projects: IProject[] = data?.results ?? [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [projectForEdit, setProjectForEdit] = useState<IProject | null>(null);
  const [projectForDelete, setProjectForDelete] = useState<IProject | null>(
    null,
  );

  const handleOpenProjectOptions = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  if (isError) {
    return (
      <PageLayout>
        <Alert severity="error">Failed to load projects</Alert>
      </PageLayout>
    );
  }

  if (isPending) {
    return (
      <PageLayout>
        <SkeletonList count={5} width={250} />
      </PageLayout>
    );
  }

  const handleCloseProjectMenu = () => {
    setAnchorEl(null);
  };
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
      <Box display={"flex"} flexDirection={"column"} height="100vh">
        <Box padding={3} flex="0 1 auto">
          <Typography my={3} variant={"h5"} component={"h2"}>
            My Projects
          </Typography>
        </Box>
        <Box
          sx={{
            flex: "1 1 auto",
            width: "100%",
            overflowX: "auto",
            paddingX: 3,
          }}
        >
          <Box overflow={"auto"}>
            <Box maxWidth={600} mx={"auto"}>
              <Stack spacing={1}>
                <Textfield
                  fullWidth
                  placeholder="Search projects"
                  aria-label="Search"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                  pr={2}
                >
                  <AddProjectButton />
                </Box>
                <Stack spacing={2}>
                  <Typography fontSize={16} variant="caption">
                    {projects.length} Project{projects.length !== 1 ? "s" : ""}
                  </Typography>
                  <List disablePadding>
                    {projects.map((project) => (
                      <>
                        <ListItemButton
                          key={project.id}
                          sx={{ borderTop: "1px solid #e0e0e0" }}
                          onClick={() => {
                            navigate(`/app/project/${project.id}`);
                          }}
                        >
                          <ListItem
                            secondaryAction={
                              <>
                                <IconButton
                                  onClick={handleOpenProjectOptions}
                                  edge="end"
                                  aria-label="comments"
                                >
                                  <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                  id="project-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleCloseProjectMenu}
                                  MenuListProps={{
                                    "aria-labelledby": "comment-options-button",
                                  }}
                                >
                                  <MenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setProjectForEdit(project);
                                      handleCloseProjectMenu();
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
                                      handleCloseProjectMenu();
                                    }}
                                  >
                                    <ListItemIcon>
                                      <DeleteIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete" />
                                  </MenuItem>
                                </Menu>
                              </>
                            }
                          >
                            <ListItemText primary={project.title} />
                          </ListItem>
                        </ListItemButton>
                      </>
                    ))}
                  </List>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
