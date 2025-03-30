import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

import useThemeContext from "../hooks/useThemeContext";

function ConfirmDeleteDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
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
          <Button onClick={handleClose}>Yes, I&apos;m sure</Button>
          <Button onClick={handleClose}>No, go back</Button>
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
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Container>
      <Box maxWidth={600}>
        <Typography variant="h5" my={3} component={"h2"}>
          Settings
        </Typography>
        <Stack spacing={4} my={2}>
          <Stack spacing={2}>
            <Typography variant="h6" component={"h3"}>
              Theme
            </Typography>
            <ThemeSelect />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h6" component={"h3"}>
              Account
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Delete Account
              </Button>
              <Alert severity="error">Account deletion cannot be undone.</Alert>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <ConfirmDeleteDialog
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </Container>
  );
}
