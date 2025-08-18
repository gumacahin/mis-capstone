import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { Tag } from "@shared/types/common";
import { useState } from "react";

import LabelDeleteDialog from "./LabelDeleteDialog";
import LabelEditDialog from "./LabelEditDialog";

export interface LabelMenuProps {
  anchorEl: null | HTMLElement;
  label: Tag;
  handleClose: () => void;
}
export default function LabelMenu({
  anchorEl,
  label,
  handleClose,
}: LabelMenuProps) {
  const [labelForEdit, setLabelForEdit] = useState<Tag | null>(null);
  const [labelForDelete, setLabelForDelete] = useState<Tag | null>(null);

  return (
    <>
      {labelForDelete && (
        <LabelDeleteDialog
          open={!!labelForDelete}
          label={labelForDelete}
          handleClose={() => setLabelForDelete(null)}
        />
      )}
      {labelForEdit && (
        <LabelEditDialog
          open={!!labelForEdit}
          label={labelForEdit}
          handleClose={() => setLabelForEdit(null)}
        />
      )}
      <Menu
        id="label-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `label-options-button-${label}`,
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setLabelForEdit(label);
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
            setLabelForDelete(label);
            handleClose();
          }}
          sx={{
            color: (theme) => theme.palette.error.main,
          }}
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
