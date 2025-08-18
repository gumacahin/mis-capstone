import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useUpdateProfile } from "@shared/hooks/queries";
import useProfileContext from "@shared/hooks/useProfileContext";
import useThemeContext from "@shared/hooks/useThemeContext";
import { GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

interface FormValues {
  theme: "light" | "dark" | "system";
  name: string;
  isFaculty: boolean;
  isStudent: boolean;
}

export default function SettingsPage() {
  const profile = useProfileContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [open, setOpen] = useState<boolean>(false);
  const defaultValues: FormValues = {
    theme: profile?.theme ?? "system",
    name: profile?.name ?? "",
    isFaculty: profile?.is_faculty ?? false,
    isStudent: profile?.is_student ?? false,
  };
  const { setMode } = useThemeContext();
  const { handleSubmit, register, watch, setValue, formState, reset } =
    useForm<FormValues>({
      defaultValues,
    });

  const onSubmit = async (data: FormValues) => {
    const newValues = {
      name: data.name,
      is_student: data.isStudent,
      is_faculty: data.isFaculty,
      is_onboarded: true,
      theme: data.theme,
    };
    setIsLoading(true);
    await toast.promise(updateProfile(newValues), {
      loading: "Saving  settings...",
      success: "Settings saved successfully!",
      error: "Error: Failed saving settings.",
    });
    reset(newValues);
    setMode(data.theme);
    setIsLoading(false);
  };
  return (
    <Container>
      <Box maxWidth={600} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} my={2}>
          <Typography variant="h5" my={3} component={"h2"}>
            Settings
          </Typography>
          <Stack spacing={3}>
            <Typography variant="h6" component={"h3"}>
              Profile
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              helperText="What should we call you?"
              size="medium"
              placeholder="Enter your name"
              {...register("name")}
            />
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <FormLabel
                        htmlFor="student-switch"
                        className="text-lg font-semibold text-gray-800 cursor-pointer"
                      >
                        I’m a UPOU Student
                      </FormLabel>
                      <p className="text-gray-600 mt-1">
                        Currently enrolled in UPOU programs
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="student-switch"
                    checked={watch("isStudent")}
                    onChange={(event) =>
                      setValue("isStudent", event.target.checked, {
                        shouldDirty: true,
                      })
                    }
                    className="scale-125"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Faculty Switch */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <FormLabel
                        htmlFor="faculty-switch"
                        className="text-lg font-semibold text-gray-800 cursor-pointer"
                      >
                        I’m a UPOU Faculty
                      </FormLabel>
                      <p className="text-gray-600 mt-1">
                        Teaching or working at UPOU
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="faculty-switch"
                    checked={watch("isFaculty")}
                    onChange={(event) =>
                      setValue("isFaculty", event.target.checked, {
                        shouldDirty: true,
                      })
                    }
                    className="scale-125"
                  />
                </div>
              </CardContent>
            </Card>
            <Alert severity="info" title="Why we ask this">
              By knowing your role at UPOU, we can provide you a better
              experience. Students will get study-focused recommendations,
              faculty members will receive teaching and research-oriented
              suggestions, and those with both roles will get the best of both
              worlds.
            </Alert>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h6" component={"h3"}>
              Appearance
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                label="Theme"
                labelId="theme-select-label"
                id="theme-select"
                value={watch("theme")}
                {...register("theme")}
              >
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formState.isDirty || isLoading}
          >
            Save Changes
          </Button>
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
