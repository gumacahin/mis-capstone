import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TodayPage from './TodayPage';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isAuthenticated) {
    return <TodayPage />;
  }

  if (isLoading) {
    return (
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Box>
      <h1>Hello World!</h1>
    </Box>
  );
}

export default HomePage;
