import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Textfield from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProjects } from "../api";
import AddProjectButton from "../components/AddProjectButton";
import PageLayout from "../components/PageLayout";
import ProjectMenu from "../components/ProjectMenu";
import SkeletonList from "../components/SkeletonList";
import type { Project } from "../types/common";

export default function ProjectsListPage() {
  const { isPending, isError, data } = useProjects();

  const projects: Project[] = data?.results ?? [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [project, setProject] = useState<Project | null>(null);

  const handleOpenProjectMenu = (
    event: MouseEvent<HTMLButtonElement>,
    project: Project,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setProject(project);
  };

  const handleCloseProjectMenu = () => {
    setAnchorEl(null);
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

  return (
    <>
      {project && (
        <ProjectMenu
          anchorEl={anchorEl}
          project={project}
          handleClose={handleCloseProjectMenu}
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
                    <Divider component="li" aria-hidden={true} />
                    {projects.map((project) => (
                      <>
                        <ListItem
                          divider
                          key={project.id}
                          disablePadding
                          secondaryAction={
                            <>
                              <IconButton
                                onClick={(e) =>
                                  handleOpenProjectMenu(e, project)
                                }
                                edge="end"
                                aria-label="project-options"
                                id={`project-options-button-${project.id}`}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </>
                          }
                        >
                          <ListItemButton
                            onClick={() => {
                              navigate(`/app/project/${project.id}`);
                            }}
                          >
                            <ListItemText primary={project.title} />
                          </ListItemButton>
                        </ListItem>
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
