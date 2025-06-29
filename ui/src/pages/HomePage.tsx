import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoginButton from "../components/LoginButton";
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

  return (
    <Box
      sx={{ flexGrow: 1 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={"100vh"}
    >
      <Container>
        <Stack spacing={2} alignItems={"center"}>
          <Typography variant={"h1"} fontSize={"sm"}>
            Welcome to UPOU Todo App
          </Typography>
          <ButtonGroup>
            <LoginButton color={"primary"} size={"large"} variant={"contained"}>
              Get Started
            </LoginButton>
          </ButtonGroup>
        </Stack>
      </Container>
    </Box>
  );
}

export default HomePage;
