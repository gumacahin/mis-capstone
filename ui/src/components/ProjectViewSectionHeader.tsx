import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MouseEvent, useContext, useState } from "react";

import SectionContext from "../contexts/sectionContext";
import { Section } from "../types/common";
import SectionDeleteDialog from "./SectionDeleteDialog";
import SectionEditDialog from "./SectionEditDialog";

export default function ProjectSectionHeader() {
  const section = useContext<Section | null>(SectionContext)!;
  const [sectionForEdit, setSectionForEdit] = useState<Section | null>(null);
  const [sectionForDelete, setSectionForDelete] = useState<Section | null>(
    null,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenSectionMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSectionMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {sectionForDelete && (
        <SectionDeleteDialog
          open={!!sectionForDelete}
          section={sectionForDelete}
          handleClose={() => setSectionForDelete(null)}
        />
      )}
      {sectionForEdit && (
        <SectionEditDialog
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
              {section.is_default ? "(No Section)" : section.title}{" "}
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
