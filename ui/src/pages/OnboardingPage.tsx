import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useUpdateProfile } from "@shared/hooks/queries";
import useProfileContext from "@shared/hooks/useProfileContext";
import {
  ArrowRight,
  CheckSquare,
  GraduationCap,
  Loader2,
  SkipForward,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormValues {
  name: string;
  isStudent: boolean;
  isFaculty: boolean;
  useCustomEmail: boolean;
  notificationEmail: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const profile = useProfileContext();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.is_onboarded) {
      navigate("/today");
    }
  }, [profile, navigate]);

  // Auto-populate name from Auth0 user if available
  const getDefaultName = () => {
    if (user?.nickname) return user.nickname;
    if (user?.email) return user.email.split("@")[0];
    return "";
  };

  const defaultValues: FormValues = {
    name: getDefaultName(),
    isStudent: false,
    isFaculty: false,
    useCustomEmail: false,
    notificationEmail: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
    getValues,
    control,
  } = useForm<FormValues>({
    defaultValues,
    mode: "onTouched", // show errors after first blur/touch
    reValidateMode: "onChange",
    shouldUnregister: true, // hidden fields won't keep stale errors
  });

  const handleSkip = async () => {
    if (!user) {
      toast.error("Please sign in first to continue");
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      await toast.promise(updateProfile({ is_onboarded: true }), {
        loading: "Setting up your account...",
        success: "Welcome to UPOU Todo! 🎉",
        error: "Failed to complete setup. Please try again.",
      });
      navigate("/today");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Please sign in first to continue");
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      await toast.promise(
        updateProfile({
          name: data.name,
          is_student: data.isStudent,
          is_faculty: data.isFaculty,
          notification_email: data.useCustomEmail
            ? data.notificationEmail
            : undefined,
          is_onboarded: true,
        }),
        {
          loading: "Setting up your profile...",
          success: "Profile set up successfully! 🎉",
          error: "Failed to create profile. Please try again.",
        },
      );
      navigate("/today");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const useCustomEmail = watch("useCustomEmail");

  // When switching off custom email, clear value & errors. Do not auto-trigger errors when switching on.
  useEffect(() => {
    if (!useCustomEmail) {
      setValue("notificationEmail", "");
      clearErrors("notificationEmail");
    }
  }, [useCustomEmail, setValue, clearErrors]);

  // Show message for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8a1538] via-[#b91d47] to-[#5a0e24] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <Card
            className="shadow-2xl border-0 rounded-3xl overflow-hidden"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              "@media (prefers-color-scheme: dark)": {
                backgroundColor: "rgba(31, 41, 55, 0.95)",
              },
            }}
          >
            {/* Header Section with Background */}
            <div className="bg-gradient-to-r from-[#8a1538]/5 to-[#5a0e24]/5 dark:from-[#8a1538]/10 dark:to-[#5a0e24]/10 p-12 border-b border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="flex items-center justify-center mb-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#8a1538] to-[#5a0e24] text-white shadow-xl">
                    <CheckSquare className="h-12 w-12" />
                  </div>
                </div>
                <Typography
                  variant="h2"
                  component="h1"
                  className="font-bold mb-4 bg-gradient-to-r from-[#8a1538] to-[#5a0e24] bg-clip-text text-transparent"
                >
                  Welcome to UPOU Todo
                </Typography>
                <Typography
                  variant="h6"
                  className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                >
                  Almost there! Please sign in first to complete your onboarding
                  and start organizing your UPOU work
                </Typography>
              </div>
            </div>

            <CardContent className="p-12">
              <div className="text-center">
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    height: "60px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #8a1538 0%, #5a0e24 100%)",
                    color: "white",
                    boxShadow: "0 8px 32px rgba(138, 21, 56, 0.3)",
                    px: 6,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a0e24 0%, #8a1538 100%)",
                      boxShadow: "0 12px 40px rgba(138, 21, 56, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                  aria-label="Go to sign in page to authenticate"
                >
                  Go to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8a1538] via-[#b91d47] to-[#5a0e24] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl"
        noValidate
      >
        <Card
          className="shadow-2xl border-0 rounded-3xl overflow-hidden"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(8px)",
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "rgba(31, 41, 55, 0.95)",
            },
          }}
        >
          {/* Header Section with Background */}
          <div className="bg-gradient-to-r from-[#8a1538]/5 to-[#5a0e24]/5 dark:from-[#8a1538]/10 dark:to-[#5a0e24]/10 p-12 border-b border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#8a1538] to-[#5a0e24] text-white shadow-xl">
                  <CheckSquare className="h-12 w-12" />
                </div>
              </div>
              <Typography
                variant="h2"
                component="h1"
                className="font-bold mb-4 bg-gradient-to-r from-[#8a1538] to-[#5a0e24] bg-clip-text text-transparent"
              >
                Welcome to UPOU Todo
              </Typography>
              <Typography
                variant="h6"
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Let&apos;s personalize your experience to help you succeed at
                the University of the Philippines Open University
              </Typography>
            </div>
          </div>

          <CardContent className="p-12">
            {/* Form Fields */}
            <div className="space-y-12">
              {/* Name Field */}
              <div className="space-y-4">
                <div className="border-l-4 border-[#8a1538] pl-6">
                  <Typography
                    variant="h5"
                    component="h2"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Personal Information
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Help us get to know you better
                  </Typography>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                  <FormLabel htmlFor="name">
                    <Typography
                      variant="h6"
                      fontWeight="medium"
                      className="text-gray-800 dark:text-gray-100 mb-3"
                    >
                      What should we call you? *
                    </Typography>
                  </FormLabel>
                  <Input
                    id="name"
                    data-testid="name-input"
                    fullWidth
                    size="medium"
                    placeholder="Enter your full name"
                    disableUnderline
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    sx={{
                      fontSize: "1.25rem",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "16px 20px",
                      border: errors.name
                        ? "2px solid #dc2626"
                        : "2px solid #e5e7eb",
                      color: "inherit",
                      "&:hover": {
                        borderColor: errors.name ? "#dc2626" : "#8a1538",
                      },
                      "&.Mui-focused": {
                        borderColor: errors.name ? "#dc2626" : "#8a1538",
                        boxShadow: errors.name
                          ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                          : "0 0 0 3px rgba(138, 21, 56, 0.1)",
                      },
                      "& .MuiInputBase-input": {
                        color: "inherit",
                        "&::placeholder": {
                          color: "rgba(107, 114, 128, 0.7)",
                          opacity: 1,
                        },
                      },
                      // Dark mode styles
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: "#1f2937",
                        borderColor: errors.name ? "#dc2626" : "#374151",
                        "&:hover": {
                          borderColor: errors.name ? "#dc2626" : "#8a1538",
                        },
                        "&.Mui-focused": {
                          borderColor: errors.name ? "#dc2626" : "#8a1538",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(156, 163, 175, 0.7)",
                        },
                      },
                    }}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters long",
                      },
                      maxLength: {
                        value: 100,
                        message: "Name must be less than 100 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <FormHelperText
                      id="name-error"
                      error
                      sx={{ fontSize: "0.875rem", mt: "8px" }}
                    >
                      {errors.name.message}
                    </FormHelperText>
                  )}
                </div>
              </div>

              {/* Notification Email Section */}
              <div className="space-y-4">
                <div className="border-l-4 border-[#8a1538] pl-6">
                  <Typography
                    variant="h5"
                    component="h2"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Notification Preferences
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Where should we send your task reminders and updates?
                  </Typography>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                  {/* Default Option */}
                  <div className="flex items-center space-x-3 mb-6">
                    <input
                      type="radio"
                      id="use-login-email"
                      data-testid="use-login-email-radio"
                      checked={!watch("useCustomEmail")}
                      onChange={() =>
                        setValue("useCustomEmail", false, {
                          shouldValidate: false,
                        })
                      }
                      className="h-4 w-4 text-[#8a1538] focus:ring-[#8a1538] border-gray-300"
                    />
                    <label
                      htmlFor="use-login-email"
                      className="flex-1 cursor-pointer"
                    >
                      <Typography
                        variant="h6"
                        className="font-medium text-gray-800 dark:text-gray-100"
                      >
                        Use my login email
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-600 dark:text-gray-400 mt-1"
                      >
                        {user?.email}
                      </Typography>
                    </label>
                  </div>

                  {/* Custom Option */}
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="radio"
                      id="use-custom-email"
                      data-testid="use-custom-email-radio"
                      checked={useCustomEmail}
                      onChange={() =>
                        setValue("useCustomEmail", true, {
                          shouldValidate: false,
                        })
                      }
                      className="h-4 w-4 text-[#8a1538] focus:ring-[#8a1538] border-gray-300"
                    />
                    <label
                      htmlFor="use-custom-email"
                      className="cursor-pointer"
                    >
                      <Typography
                        variant="h6"
                        className="font-medium text-gray-800 dark:text-gray-100"
                      >
                        Use a different email
                      </Typography>
                    </label>
                  </div>

                  {/* Custom Email Field */}
                  {useCustomEmail && (
                    <div className="mt-4 ml-7">
                      <Input
                        type="email"
                        data-testid="notification-email-input"
                        placeholder="Enter notification email"
                        fullWidth
                        disableUnderline
                        aria-invalid={!!errors.notificationEmail}
                        aria-describedby={
                          errors.notificationEmail
                            ? "notificationEmail-error"
                            : undefined
                        }
                        sx={{
                          fontSize: "1rem",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          border: errors.notificationEmail
                            ? "2px solid #dc2626"
                            : "2px solid #e5e7eb",
                          color: "inherit",
                          "&:hover": {
                            borderColor: errors.notificationEmail
                              ? "#dc2626"
                              : "#8a1538",
                          },
                          "&.Mui-focused": {
                            borderColor: errors.notificationEmail
                              ? "#dc2626"
                              : "#8a1538",
                            boxShadow: errors.notificationEmail
                              ? "0 0 0 3px rgba(220, 38, 38, 0.1)"
                              : "0 0 0 3px rgba(138, 21, 56, 0.1)",
                          },
                          "& .MuiInputBase-input": {
                            color: "inherit",
                            "&::placeholder": {
                              color: "rgba(107, 114, 128, 0.7)",
                              opacity: 1,
                            },
                          },
                          "@media (prefers-color-scheme: dark)": {
                            backgroundColor: "#1f2937",
                            borderColor: errors.notificationEmail
                              ? "#dc2626"
                              : "#374151",
                            "&:hover": {
                              borderColor: errors.notificationEmail
                                ? "#dc2626"
                                : "#8a1538",
                            },
                            "&.Mui-focused": {
                              borderColor: errors.notificationEmail
                                ? "#dc2626"
                                : "#8a1538",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: "rgba(156, 163, 175, 0.7)",
                            },
                          },
                        }}
                        {...register("notificationEmail", {
                          validate: (value) => {
                            const useCustom = getValues("useCustomEmail");
                            if (!useCustom) return true;
                            if (!value?.trim())
                              return "Please enter a notification email";
                            if (!/^\S+@\S+\.\S+$/.test(value)) {
                              return "Please enter a valid email address";
                            }
                            if (value === user?.email) {
                              return "Notification email must be different from your sign-in email";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.notificationEmail && (
                        <FormHelperText
                          id="notificationEmail-error"
                          error
                          sx={{ fontSize: "0.875rem", marginTop: "8px" }}
                        >
                          {errors.notificationEmail.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* UPOU Affiliation Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#8a1538] pl-6">
                  <Typography
                    variant="h5"
                    component="h2"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Your UPOU Connection
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Help us understand your role at UPOU to personalize your
                    experience
                  </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Option */}
                  <Card
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      watch("isStudent")
                        ? "border-[#8a1538] bg-[#8a1538]/5 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-[#8a1538]/50 hover:shadow-md"
                    }`}
                    sx={{
                      backgroundColor: watch("isStudent")
                        ? "rgba(138, 21, 56, 0.05)"
                        : undefined,
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: watch("isStudent")
                          ? "rgba(138, 21, 56, 0.15)"
                          : "#1f2937",
                      },
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto ${
                            watch("isStudent")
                              ? "bg-[#8a1538] text-white"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <GraduationCap className="h-8 w-8" />
                        </div>
                        <div>
                          <FormLabel htmlFor="student-switch">
                            <Typography
                              variant="h6"
                              className="font-semibold text-gray-800 dark:text-gray-100"
                            >
                              I&apos;m a UPOU Student
                            </Typography>
                          </FormLabel>
                          <Typography
                            variant="body2"
                            id="student-description"
                            className="text-gray-600 dark:text-gray-300 mt-1"
                          >
                            Currently enrolled in UPOU programs
                          </Typography>
                        </div>
                        <Controller
                          name="isStudent"
                          control={control}
                          render={({ field }) => (
                            <Switch
                              id="student-switch"
                              data-testid="student-switch"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#8a1538",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#8a1538",
                                  },
                              }}
                              inputProps={{
                                "aria-describedby": "student-description",
                              }}
                            />
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Faculty Option */}
                  <Card
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      watch("isFaculty")
                        ? "border-[#8a1538] bg-[#8a1538]/5 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-[#8a1538]/50 hover:shadow-md"
                    }`}
                    sx={{
                      backgroundColor: watch("isFaculty")
                        ? "rgba(138, 21, 56, 0.05)"
                        : undefined,
                      "@media (prefers-color-scheme: dark)": {
                        backgroundColor: watch("isFaculty")
                          ? "rgba(138, 21, 56, 0.15)"
                          : "#1f2937",
                      },
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto ${
                            watch("isFaculty")
                              ? "bg-[#8a1538] text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Users className="h-8 w-8" />
                        </div>
                        <div>
                          <FormLabel htmlFor="faculty-switch">
                            <Typography
                              variant="h6"
                              className="font-semibold text-gray-800 dark:text-gray-100"
                            >
                              I&apos;m a UPOU Faculty
                            </Typography>
                          </FormLabel>
                          <Typography
                            variant="body2"
                            id="faculty-description"
                            className="text-gray-600 dark:text-gray-300 mt-1"
                          >
                            Teaching or working at UPOU
                          </Typography>
                        </div>
                        <Controller
                          name="isFaculty"
                          control={control}
                          render={({ field }) => (
                            <Switch
                              id="faculty-switch"
                              data-testid="faculty-switch"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#8a1538",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#8a1538",
                                  },
                              }}
                              inputProps={{
                                "aria-describedby": "faculty-description",
                              }}
                            />
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-semibold text-blue-900 dark:text-blue-100 mb-2"
                    >
                      Why we ask this
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-blue-800 dark:text-blue-200 leading-relaxed"
                    >
                      By knowing your role at UPOU, we can provide you a better
                      experience. Students will get study-focused
                      recommendations, faculty members will receive teaching and
                      research-oriented suggestions, and those with both roles
                      will get the best of both worlds.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-16 pt-8 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="outlined"
                data-testid="skip-onboarding-button"
                onClick={handleSkip}
                disabled={isLoading}
                sx={{
                  flex: 1,
                  height: "60px",
                  fontSize: "1.1rem",
                  borderRadius: "16px",
                  borderWidth: "2px",
                  borderColor: "#d1d5db",
                  color: "#6b7280",
                  backgroundColor: "transparent",
                  "&:hover": {
                    borderColor: "#8a1538",
                    backgroundColor: "#8a1538/5",
                    color: "#8a1538",
                  },
                  "&:disabled": { opacity: 0.5 },
                }}
                aria-label="Skip onboarding and continue with default settings"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <SkipForward className="mr-2 h-5 w-5" />
                )}
                Skip for now
              </Button>

              <Button
                type="submit"
                data-testid="get-started-button"
                disabled={isLoading} // RHF will prevent submit if invalid; we don't hard-gate here
                sx={{
                  flex: 1,
                  height: "60px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #8a1538 0%, #5a0e24 100%)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(138, 21, 56, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a0e24 0%, #8a1538 100%)",
                    boxShadow: "0 12px 40px rgba(138, 21, 56, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
                }}
                aria-label="Complete onboarding with provided information"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400"
              >
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
