import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import {
  ArrowRight,
  CheckSquare,
  GraduationCap,
  SkipForward,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useUpdateProfile } from "../hooks/queries";
import useProfileContext from "../hooks/useProfileContext";

interface FormValues {
  name: string;
  isStudent: boolean;
  isFaculty: boolean;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const profile = useProfileContext();
  const { mutate: updateProfile } = useUpdateProfile();

  useEffect(() => {
    if (profile && profile.is_onboarded) {
      navigate("/today");
    }
  }, [profile, navigate]);

  const defaultValues: FormValues = {
    name: "UPOU Todo User",
    isStudent: false,
    isFaculty: false,
  };

  const { register, watch, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues,
  });

  const handleSkip = () => {
    updateProfile({
      is_onboarded: true,
    });
    navigate("/today");
  };

  const onSubmit = (data: FormValues) => {
    updateProfile({
      name: data.name,
      is_student: data.isStudent,
      is_faculty: data.isFaculty,
      is_onboarded: true,
    });
    navigate("/today");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8a1538] via-[#b91d47] to-[#5a0e24] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a1538] to-[#5a0e24] text-white shadow-lg">
                  <CheckSquare className="h-10 w-10" />
                </div>
              </div>
              <Typography variant="h3" component="h1">
                Welcome to UPOU Todo
              </Typography>
              <Typography variant="subtitle1">
                Let’s personalize your experience to help you succeed at the
                University of the Philippines Open University
              </Typography>
            </div>

            {/* Form Fields */}
            <div className="space-y-10">
              {/* Name Field */}
              <div className="space-y-1 flex flex-col">
                <FormLabel htmlFor="name">
                  <Typography variant="body1" fontWeight="semibold">
                    What should we call you?
                  </Typography>
                </FormLabel>
                <Input
                  id="name"
                  fullWidth
                  size="medium"
                  placeholder="Enter your name"
                  sx={{ fontSize: "2rem" }}
                  {...register("name")}
                />
              </div>

              {/* UPOU Affiliation Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <Typography variant="h4" component="h2" className="mb-2">
                    Your UPOU Connection
                  </Typography>
                  <Typography variant="subtitle1">
                    Help us understand your role at UPOU
                  </Typography>
                </div>

                {/* Student Switch */}
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <FormLabel htmlFor="student-switch">
                            <Typography variant="subtitle1">
                              I’m a UPOU Student
                            </Typography>
                          </FormLabel>
                          <Typography variant="body2">
                            Currently enrolled in UPOU programs
                          </Typography>
                        </div>
                      </div>
                      <Switch
                        id="student-switch"
                        checked={watch("isStudent")}
                        onChange={(event) =>
                          setValue("isStudent", event.target.checked)
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
                            <Typography variant="subtitle1">
                              I’m a UPOU Faculty
                            </Typography>
                          </FormLabel>
                          <Typography variant="body2">
                            Teaching or working at UPOU
                          </Typography>
                        </div>
                      </div>
                      <Switch
                        id="faculty-switch"
                        checked={watch("isFaculty")}
                        onChange={(event) =>
                          setValue("isFaculty", event.target.checked)
                        }
                        className="scale-125"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Section */}
              <Alert title="Why we ask this" severity="info">
                By knowing your role at UPOU, we can provide you a better
                experience. Students will get study-focused recommendations,
                faculty members will receive teaching and research-oriented
                suggestions, and those with both roles will get the best of both
                worlds.
              </Alert>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button
                variant="outlined"
                onClick={handleSkip}
                className="flex-1 h-14 text-lg border-2 border-gray-300 hover:border-gray-400 rounded-xl bg-transparent"
              >
                <SkipForward className="mr-2 h-5 w-5" />
                Skip for now
              </Button>
              <Button
                type="submit"
                className="!text-white flex-1 h-14 text-lg bg-gradient-to-r bg-gradient-to-r from-[#8a1538] to-[#5a0e24] hover:from-[#5a0e24] hover:to-[#8a1538] rounded-xl shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <Typography variant="caption">
                You can always update these preferences later in your profile
                settings.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
