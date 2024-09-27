import { useState } from "react";
import {
  Typography,
  Stack,
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useThemeContext } from "../components/ThemeContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDeleteDialog({ open, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">
          {"Are you sure you want to delete your account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-dialog-description">
            This action cannot be undone. All your data will be lost forever.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Yes, I'm sure
          </Button>
          <Button onClick={handleClose} autoFocus>
            No, go back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ThemeSelect() {
  const { mode, setMode } = useThemeContext();

  const handleChange = (event: SelectChangeEvent) => {
    setMode(event.target.value as "light" | "dark" | "system");
  };

  const label = "Current Theme";

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="theme-select-label">{label}</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={mode}
          label={label}
          onChange={handleChange}
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default function SettingsPage() {
  const [open, setOpen] = useState<Boolean>(false);
  return (
    <>
      <Box maxWidth={600}>
        <Typography variant="h4" my={3}>
          Settings
        </Typography>
        <Stack spacing={4} my={2}>
          <Stack spacing={2}>
            <Typography variant="h5">Theme</Typography>
            <ThemeSelect />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5">Account</Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(true)}
              >
                Delete Account
              </Button>
              <Alert severity="error">Account deletion cannot be undone.</Alert>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <ConfirmDeleteDialog open={open} handleClose={() => setOpen(false)} />
    </>
  );
}
