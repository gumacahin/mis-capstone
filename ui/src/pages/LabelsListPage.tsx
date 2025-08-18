import AddLabelButton from "@labels/components/AddLabelButton";
import LabelMenu from "@labels/components/LabelMenu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SkeletonList from "@shared/components/SkeletonList";
import { useTags } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import type { Tag } from "@shared/types/common";
import { slugify } from "@shared/utils";
import PageLayout from "@views/components/PageLayout";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LabelListPage() {
  const { isPending, isError, data } = useTags();

  const tags: Tag[] = data?.results ?? [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const { setToolbarTitle } = useToolbarContext();

  useEffect(() => {
    setToolbarTitle(null);
  }, [setToolbarTitle]);

  const handleOpenTagMenu = (
    event: MouseEvent<HTMLButtonElement>,
    tag: Tag,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setTag(tag);
  };

  const handleCloseProjectMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  if (isError) {
    return (
      <PageLayout>
        <Alert severity="error">Failed to load labels.</Alert>
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
      {tag && (
        <LabelMenu
          anchorEl={anchorEl}
          label={tag}
          handleClose={handleCloseProjectMenu}
        />
      )}
      <Box display={"flex"} flexDirection={"column"} height="100vh">
        <Box padding={3} flex="0 1 auto" justifyContent={"space-between"}>
          <Typography my={3} variant={"h5"} component={"h2"}>
            My Labels
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
              <Stack spacing={2}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography fontSize={16} variant="caption">
                    Labels
                  </Typography>
                  <AddLabelButton />
                </Box>
                {tags.length == 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Your list of labels will show up here.
                  </Typography>
                ) : (
                  <List disablePadding>
                    <Divider component="li" aria-hidden={true} />
                    {tags.map((tag) => (
                      <ListItem
                        divider
                        key={tag.name}
                        disablePadding
                        secondaryAction={
                          <>
                            <IconButton
                              onClick={(e) => handleOpenTagMenu(e, tag)}
                              edge="end"
                              aria-label="tag-options"
                              id={`tag-options-button-${tag.name}`}
                            >
                              <MoreHorizIcon />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemButton
                          onClick={() => {
                            navigate(`/label/${slugify(tag.name)}`);
                          }}
                        >
                          <ListItemText primary={tag.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
