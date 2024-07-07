import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect, isLoading, isAuthenticated} = useAuth0();

  if (isLoading) {
    return null;
  }

  return !isAuthenticated && (<Button color="inherit" onClick={() => loginWithRedirect()}>Log In</Button>);
};

export default LoginButton;
