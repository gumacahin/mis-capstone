import CloseIcon from "@mui/icons-material/Close";
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
import AddProjectButton from "@projects/components/AddProjectButton";
import ProjectMenu from "@projects/components/ProjectMenu";
import SkeletonList from "@shared/components/SkeletonList";
import { useProjects } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import type { Project } from "@shared/types/common";
import PageLayout from "@views/components/PageLayout";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsListPage() {
  const { isPending, isError, data } = useProjects();

  const projects: Project[] = useMemo(() => data?.results ?? [], [data]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const { setToolbarTitle } = useToolbarContext();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
  };

  useEffect(() => {
    setToolbarTitle(null);
  }, [setToolbarTitle]);

  useEffect(() => {
    if (search) {
      setFilteredProjects(
        projects.filter((project) =>
          project.title.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredProjects(projects);
    }
  }, [search, projects]);
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
          project={{
            ...project,
            view: "list" as const,
            sections: project.sections.map((section) => ({
              ...section,
              project: project.id,
              tasks: [],
              order: 0,
            })),
          }}
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
                  onChange={handleSearch}
                  value={search}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {search && (
                            <IconButton
                              onClick={() => {
                                setSearch("");
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
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
                    {filteredProjects.length} Project
                    {filteredProjects.length !== 1 ? "s" : ""}
                  </Typography>
                  <List disablePadding>
                    <Divider component="li" aria-hidden={true} />
                    {filteredProjects.map((project) => (
                      <ListItem
                        divider
                        key={project.id}
                        disablePadding
                        secondaryAction={
                          <>
                            <IconButton
                              onClick={(e) => handleOpenProjectMenu(e, project)}
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
                            navigate(`/project/${project.id}`);
                          }}
                        >
                          <ListItemText primary={project.title} />
                        </ListItemButton>
                      </ListItem>
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
