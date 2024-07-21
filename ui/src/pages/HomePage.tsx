import { useAuth0 } from "@auth0/auth0-react";
import { Box, ButtonGroup, Stack, Typography } from "@mui/material";
import TodayPage from "./TodayPage";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LoginButton from "../components/LoginButton";

function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isAuthenticated) {
    return <TodayPage />;
  }

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={`calc(100vh - 64px)`}
    >
      <Stack spacing={2}>
        <Typography variant={"h1"} fontSize={"md"}>
          Welcome to UPOU Todo App
        </Typography>
        <Typography variant={"subtitle2"}>Welcome to UPOU Todo App</Typography>
        <ButtonGroup>
          <LoginButton color={"primary"} size={"large"} variant={"contained"}>
            Get Started
          </LoginButton>
        </ButtonGroup>
      </Stack>
    </Box>
  );
}

export default HomePage;
