import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Snackbar, Alert, Box, Button, Stack } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function App() {
  const location = useLocation();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.state?.showSnackbar) {
      const message = location.state.snackbarMessage || '🎉 Ride created successfully!';
      setSnackbarMessage(message);
      setShowSnackbar(true);

      // Set timer to hide snackbar after 10 seconds
      const timer = setTimeout(() => setShowSnackbar(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div>
      <Navbar />
    <Box sx={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
      {/* Fullscreen Animation */}
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <object type="image/svg+xml" data="/green3.svg" style={{width:'100%',height:'500px'}}></object>

      </Box>

      {/* Centered Buttons Below Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100vh - 190px)', // Adjust 100px based on button height and spacing
          left: '53%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Stack direction="row" spacing={4}>
          <Button  sx={{backgroundColor: '#1CAC78',color:'#20201e',border:'1px solid #20201e',fontWeight:'bold'}} variant="contained" size="large" color="primary" onClick={() => navigate('/create-ride')}>
            Offer a Ride
          </Button>
          <Button sx={{backgroundColor: '#20201e',color:'#1cac78',border:'1px solid #20201e',fontWeight:'bold'}} variant="contained" size="large" color="green" onClick={()=> navigate('/matching')}>
            Find a Ride
          </Button>
        </Stack>
      </Box>
    </Box>       
      <Footer />

      <Snackbar open={showSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          severity="success"
          sx={{
            fontSize: '1.25rem',
            py: 2,
            px: 3,
            borderRadius: 2,
            backgroundColor: '#4caf50',
            color: 'white',
            boxShadow: 3,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
