import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddProject } from "../api";
import type { IProject } from "../types/common";

export default function ProjectForm(project: IProject) {
        <Stack spacing={3}>
          <TextField
            margin="dense"
            {...register("title", { required: true })}
            label="Project title"
            type="text"
            fullWidth
            variant="standard"
          />
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              id="view-options-label"
              disabled={isLoading}
            >
              View options
            </FormLabel>
            <ToggleButtonGroup
              disabled={isLoading}
              id="view-options-label"
              exclusive
              size="large"
              aria-label="view options"
              aria-labelledby="view-options-label"
              {...register("view")}
              value={view}
              onChange={(_, value) => setValue("view", value)}
            >
              <ToggleButton value="list" aria-label="list view">
                <Stack alignItems={"center"} spacing={2}>
                  <ListIcon />
                  <Typography>List View</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="board" aria-label="board view">
                <Stack alignItems={"center"} spacing={2}>
                  <ViewModuleIcon />
                  <Typography>Board View</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
