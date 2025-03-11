import { Button, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import UserMenu from './UserMenu';


const AppBar = () => {
  const user = useAppSelector((state) => state.user)

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          Recipe-app
        </Typography>
        {!user &&
        <>
          <Button color='inherit' component={Link} to="/login">
            Login
          </Button>
          <Button color='inherit' component={Link} to="/signin">
            Sign In
          </Button>
        </>
        }
        {user &&
          <UserMenu/>
        }
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar