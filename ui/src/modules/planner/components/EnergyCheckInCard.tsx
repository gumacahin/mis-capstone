import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useEffect, useState } from "react";

import type {
  PlannerCheckInInput,
  PlannerEnergyLevel,
  PlannerFocusMode,
  TodayPlan,
} from "../types";

interface EnergyCheckInCardProps {
  disabled: boolean;
  plan?: TodayPlan;
  title: string;
  onSubmit: (input: PlannerCheckInInput) => void;
}

export default function EnergyCheckInCard({
  disabled,
  plan,
  title,
  onSubmit,
}: EnergyCheckInCardProps) {
  const [energyLevel, setEnergyLevel] = useState<PlannerEnergyLevel>("medium");
  const [availableMinutes, setAvailableMinutes] = useState(120);
  const [focusMode, setFocusMode] = useState<PlannerFocusMode>("flexible");
  const [context, setContext] = useState("");

  useEffect(() => {
    if (!plan?.check_in) return;
    setEnergyLevel(plan.check_in.energy_level);
    setAvailableMinutes(plan.check_in.available_minutes);
    setFocusMode(plan.check_in.focus_mode);
    setContext(plan.check_in.context);
  }, [plan?.check_in]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      energy_level: energyLevel,
      available_minutes: availableMinutes,
      focus_mode: focusMode,
      context,
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Typography variant="h6" component="h2" sx={{ minWidth: 120 }}>
            {title}
          </Typography>
          <TextField
            select
            size="small"
            label="Energy"
            value={energyLevel}
            onChange={(event) => {
              setEnergyLevel(event.target.value as PlannerEnergyLevel);
            }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            size="small"
            label="Minutes"
            type="number"
            value={availableMinutes}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              setAvailableMinutes(Number.isNaN(nextValue) ? 0 : nextValue);
            }}
            inputProps={{ min: 0, max: 720 }}
          />
          <TextField
            select
            size="small"
            label="Focus"
            value={focusMode}
            onChange={(event) => {
              setFocusMode(event.target.value as PlannerFocusMode);
            }}
          >
            <MenuItem value="flexible">Flexible</MenuItem>
            <MenuItem value="deep">Deep</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="light">Light</MenuItem>
          </TextField>
          <TextField
            size="small"
            label="Context"
            value={context}
            onChange={(event) => {
              setContext(event.target.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained" disabled={disabled}>
            Update
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
