import { useAuth0 } from "@auth0/auth0-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";
import useProfileContext from "../hooks/useProfileContext";

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

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar sx={{ justifyContent: "start" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            UPOU Todo
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 400,
              mb: 3,
            }}
          >
            Plan your UPOU work in one place
          </Typography>

          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            For UPOU faculty and students&mdash;capture tasks, plan schedules,
            and track progress for courses, teaching, research, and campus work.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: 6, px: 4, py: 1.5 }}
            href="/today"
          >
            Open app
          </Button>
        </Box>

        {/* Three Bullets */}
        <Box display="flex" sx={{ mb: 6 }} margin="auto">
          <List sx={{ maxWidth: 600, mx: "auto" }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Typography>
                    <strong>Organize</strong> by course or project with
                    priorities
                  </Typography>
                }
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "1.1rem",
                    fontWeight: 400,
                  },
                }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Typography>
                    <strong>Plan</strong> the week; see today, due, and upcoming
                  </Typography>
                }
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "1.1rem",
                    fontWeight: 400,
                  },
                }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Typography>
                    <strong>Get reminders</strong> for due and overdue tasks
                  </Typography>
                }
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "1.1rem",
                    fontWeight: 400,
                  },
                }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Access & Privacy Note */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Sign in with UP Mail. Your tasks are private to your account.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #e0e0e0",
          py: 3,
          mt: "auto",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {currentYear} UPOU Todo · UP Mail required
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MuiLink
                href="#"
                variant="body2"
                underline="hover"
                color="text.secondary"
              >
                Privacy
              </MuiLink>
              <Typography variant="body2" color="text.secondary">
                ·
              </Typography>
              <MuiLink
                href="#"
                variant="body2"
                underline="hover"
                color="text.secondary"
              >
                Terms of Use
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default HomePage;
