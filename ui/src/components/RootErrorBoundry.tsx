import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useRouteError } from "react-router";

export default function RootErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh", // This assumes the Box is directly within the body or a full-height container
        }}
      >
        <Alert
          severity="warning"
          action={
            <Button
              onClick={() => {
                window.location.reload();
              }}
              color="inherit"
              size="small"
            >
              REFRESH
            </Button>
          }
        >
          Something went wrong. Please try refreshing the page.
        </Alert>
        <Box component={"pre"}>{error.message}</Box>
      </Box>
    </Container>
  );
}
