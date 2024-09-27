import { useState } from "react";
import {
  Typography,
  Stack,
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useThemeContext } from "../components/ThemeContext";

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
  // const { isPending, isError, data } = useTasksToday();

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Ops something went wrong...</div>;
  // }

  return (
    <>
      <Typography variant="h4" my={3}>
        Settings
      </Typography>
      <Stack spacing={4} my={2}>
        <Stack spacing={2}>
          <Typography variant="h5">Theme</Typography>
          <ThemeSelect />
        </Stack>
        <Box>
          <Typography variant="h5">Account</Typography>
          <Stack>
            <Typography>Delete Account</Typography>
            <Alert severity="warning">This cannot be undone.</Alert>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
