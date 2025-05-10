
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { Box, TextField, Button } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 17.373093,
  lng: 78.490036,
};

function MapDisplay() {
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: '',
  //   libraries: ['places'],
  // });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDrop, setAutocompleteDrop] = useState(null);

  const handleLoad = (map) => {
    setMap(map);
  };

  const handleDirections = async () => {
    if (!pickup || !drop) return;

    const directionsService = new window.google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: pickup,
      destination: drop,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(result);
  };

  // if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Autocomplete onLoad={setAutocompletePickup} onPlaceChanged={() => setPickup(autocompletePickup.getPlace().formatted_address)}>
          <TextField label="Enter location" variant="outlined" fullWidth />
        </Autocomplete>
        <Autocomplete onLoad={setAutocompleteDrop} onPlaceChanged={() => setDrop(autocompleteDrop.getPlace().formatted_address)}>
          <TextField label="Enter destination" variant="outlined" fullWidth />
        </Autocomplete>
      </Box>
      <Button variant="contained" onClick={handleDirections} sx={{ marginBottom: '10px' }}>Get Directions</Button>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={handleLoad}>
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </Box>
  );
}

export default MapDisplay;
