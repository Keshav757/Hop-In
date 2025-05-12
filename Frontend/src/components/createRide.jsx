import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import RideContext from '../context/rideContext';

const RideForm = () => {
  const [origin, setOrigin] = useState('');
  const [originPlaceId, setOriginPlaceId] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationPlaceId, setDestinationPlaceId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [vehicle, setVehicle] = useState('');
  const [directions, setDirections] = useState(null);

  const navigate = useNavigate();
  const { createRide } = useContext(RideContext);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rideData = {
      origin,
      originPlaceId,
      destination,
      destinationPlaceId,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicle
    };

    try {
      await createRide(rideData);
      console.log('Ride created successfully');
      navigate('/home', { state: { showSnackbar: true, snackbarMessage: '🎉 Ride created successfully!' } });

    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };

  const handleGetDirections = () => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, p: 2, alignItems:'center' }}>
      {/* Form Section */}
      <Box
        sx={{
          flex: 1,
          maxWidth: '45%',
          p: 4,
          backgroundColor: '#f9f9f9',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
          Create a Ride
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                onLoad={(autocomplete) => (originRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = originRef.current.getPlace();
                  setOrigin(place.formatted_address);
                  setOriginPlaceId(place.place_id);
                }}
              >
                <TextField
                  label="Origin"
                  fullWidth
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
              </Autocomplete>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = destinationRef.current.getPlace();
                  setDestination(place.formatted_address);
                  setDestinationPlaceId(place.place_id);
                }}
              >
                <TextField
                  label="Destination"
                  fullWidth
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
              </Autocomplete>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Departure Time"
                type="datetime-local"
                fullWidth
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Available Seats"
                type="number"
                fullWidth
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                required
                InputProps={{ inputProps: { min: 2 } }}
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price Per Seat"
                type="number"
                fullWidth
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(e.target.value)}
                required
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Vehicle Model"
                fullWidth
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                required
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                sx={{  backgroundColor: '#20201e', fontWeight: 'bold', color:'#1CAC78' }}
                variant="contained"
                fullWidth
                onClick={handleGetDirections}
              >
                Get Directions
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                sx={{backgroundColor: '#1CAC78', fontWeight: 'bold', color:'#20201e'}}
                variant="contained"
                fullWidth
                type="submit"
              >
                Create Ride
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Map Section */}
      <Box sx={{ flex: 1, height: '500px', ml: 2 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: 17.418974, lng: 78.526596 }}
          zoom={8}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default RideForm;
