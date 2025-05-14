import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import log from "../assets/log.png"
import signup from "../assets/gign.png"
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import User from './user-home';
const defaultTheme = createTheme();

export default function Authentication() {
    const {user,login,register}=React.useContext(AuthContext)
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage('');
        if (!username || !password) {
          if (!username) setEmailError(true);
          if (!password) setPasswordError(true);
          setErrorMessage('Email and password are required');
          return;
        }        
        const data = new FormData(event.currentTarget);
        if (formState === 0) {
            // Sign In
            const email = data.get('email');
            const password = data.get('password');
            try {
              const result =await login(email, password);
              if (result && user) {
                navigate('/home');
              }
              else if(result){
                navigate('/home')
              }
          } catch (error) {
              // If login fails, set an error message
              setErrorMessage('Invalid email or password. Please try again.');
          }
        } else {
            // Sign Up
            const name = data.get('name');
            const email = data.get('email');
            const password = data.get('password');
            const phone = data.get('phone');
            const role = data.get('role');
            
            //const vehicle = data.get('vehicle');
            const res=await register(name,email,password,phone,role);
            if(role=='driver'){
              console.log('driver')
              navigate('/vehicle-detail')
              return;
            }
            if (res && user) {
              navigate('/home');
            }
            else if(res){
              navigate('/home')
            }
        }
    };
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState();
  const [phone, setphone] = React.useState("");
  const [role, setRole] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [formState, setFormState] = React.useState(0);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${formState==0?log:signup})`, // Replace with the path to your image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <div> 
              <Button variant={formState === 0 ? "contained" : ""} style={{backgroundColor:formState===0?'#1cac78':'',color:'#20201e'}} sx={{ textTransform: 'none' }} onClick={() => setFormState(0)}>
                Sign In
              </Button>
              <Button variant={formState === 1 ? "contained" : ""} style={{backgroundColor:formState===1?'#1cac78':'',color:'#20201e'}} sx={{ textTransform: 'none' }} onClick={() => setFormState(1)}>
                Sign Up
              </Button>
            </div>
            <br />
            {formState === 0 ?
              <Typography component="h1" variant="h5">
                SIGN IN
              </Typography> :
              <Typography component="h1" variant="h5">
                SIGN UP
              </Typography>
            }
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {formState === 1 && <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
              />}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setUsername(e.target.value)}
                error={emailError} // Shows red border if error
                helperText={emailError ? 'Please enter a valid email' : ''} // Error message
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
              {formState === 1 && <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone no."
                name="phone"
                autoComplete="Phone no."
                onChange={(e) => setphone(e.target.value)}
              />}
              {formState === 1 && <TextField
                margin="normal"
                required
                fullWidth
                id="role"
                label="Role"
                name="role"
                autoComplete="role"
                onChange={(e) => setRole(e.target.value)} // Update role state
                />}
              {formState === 0 && <FormControlLabel
                control={<Checkbox value="remember" style={{color:'#1cac78'}}/>}
                label="Remember me"
              />}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, textTransform: 'none'}}
                style={{backgroundColor:formState===0?'#1cac78':'#20201e',color:formState===1?'#1cac78':'#20201e',fontWeight:'500'}}
              >
                {formState === 0 ? 'Sign In' : 'Sign Up'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}