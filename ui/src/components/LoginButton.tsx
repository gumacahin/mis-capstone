import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LoginButton = ({children, ...props}) => {
  const { loginWithRedirect, isLoading, isAuthenticated} = useAuth0();

  if (isLoading) {
    return null;
  }

  return !isAuthenticated && (<Button color="inherit" onClick={() => loginWithRedirect()} {...props}>{children ?? 'Log In'}</Button>);
};

export default LoginButton;
