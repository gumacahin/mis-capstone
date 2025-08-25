import LoginButton from "@auth/components/LoginButton";
import SignupButton from "@auth/components/SignupButton";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Spinner from "@shared/components/Spinner";
import useProfileContext from "@shared/hooks/useProfileContext";
import { Bell, Calendar, CheckSquare, GraduationCap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const profile = useProfileContext();

  useEffect(() => {
    if (isAuthenticated) {
      if (profile && !profile.is_onboarded) {
        navigate("/onboarding");
        return;
      }
      navigate("/today");
    }
  }, [isAuthenticated, navigate, profile]);

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </Box>
    );
  }

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
                Plan your UPOU work in one place
              </Typography>
              <Typography
                variant="h6"
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                For UPOU faculty and students&mdash;capture tasks, plan
                schedules, and track progress for courses, teaching, research,
                and campus work
              </Typography>
            </div>
          </div>

          <CardContent className="p-12">
            <div className="space-y-12">
              {/* Auth Buttons */}
              <div className="flex justify-center gap-6">
                <LoginButton variant="contained" size="large">
                  Sign In
                </LoginButton>
                <SignupButton variant="outlined" size="large">
                  Sign Up
                </SignupButton>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg mx-auto mb-4">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Organize
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    By course or project with priorities and deadlines
                  </Typography>
                </div>

                <div className="text-center p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg mx-auto mb-4">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Plan
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    The week; see today, due, and upcoming tasks
                  </Typography>
                </div>

                <div className="text-center p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg mx-auto mb-4">
                    <Bell className="h-8 w-8" />
                  </div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800 dark:text-gray-100 mb-2"
                  >
                    Get Reminders
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    For due and overdue tasks via email notifications
                  </Typography>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-center space-x-6 text-sm">
                  <a
                    href="javascript:void(0)"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
