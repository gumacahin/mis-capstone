import { useAuth0 } from "@auth0/auth0-react";
import { Box, ButtonGroup, Container, Stack, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoginButton from "../components/LoginButton";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
