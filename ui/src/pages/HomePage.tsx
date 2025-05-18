import { useAuth0 } from "@auth0/auth0-react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoginButton from "../components/LoginButton";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/today");
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
