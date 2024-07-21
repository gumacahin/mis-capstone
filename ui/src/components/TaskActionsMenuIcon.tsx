import IconButton  from "@mui/material/IconButton";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from "@mui/material/Menu";
import { Task } from "../types/common";

export default function TaskActionsMenuIcon(task: Task) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDelete = () => {
      handleClose();
    }

    const handleEdit = () => {
      handleClose();
    }
  
    return (
      <>
        <IconButton aria-label="task actions menu"
          id={`task-action-menu-icon-for-task-${task.id}`}
          aria-controls={open ? `` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
        <Menu
          id={`task-action-menu-for-task-${task.id}`}
          aria-labelledby={`task-action-menu-icon-for-task-${task.id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </>
    );
  }
