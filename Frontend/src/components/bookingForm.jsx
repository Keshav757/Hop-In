import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from "@mui/material";
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';

const BookingPage = () => {
  const [originRef, setOriginRef] = useState(null);
  const [destinationRef, setDestinationRef] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ridePrices, setRidePrices] = useState({});
  const navigate = useNavigate();
  const storage = window.localStorage;
  const user = JSON.parse(storage.getItem('user'));
  const userId = user?.id;

  // Modified function that returns a Promise
  const handleGetDirections = (origin, destination) => {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const distanceInMeters = result.routes[0].legs[0].distance.value;
            const distanceInKilometers = distanceInMeters / 1000;
            const calculatedPrice = Math.round(distanceInKilometers * 6); // 6 rupees per km
            resolve(calculatedPrice);
          } else {
            console.error(`Error fetching directions: ${status}`);
            reject(new Error(`Directions request failed: ${status}`));
            resolve(10); // Default price in case of error
          }
        }
      );
    });
  };

  const handleSearch = async () => {
    const originPlace = originRef?.getPlace();
    const destinationPlace = destinationRef?.getPlace();

    if (!originPlace || !destinationPlace) {
      alert("Please select both origin and destination from suggestions.");
      return;
    }

    const origin = {
      place_id: originPlace.place_id,
      address: originPlace.formatted_address,
    };

    const destination = {
      place_id: destinationPlace.place_id,
      address: destinationPlace.formatted_address,
    };

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/rides/match", {
        origin,
        destination,
      });

      setRides(response.data);

      // Calculate prices for each ride
      const pricePromises = response.data.map(async (ride) => {
        try {
          const calculatedPrice = await handleGetDirections(origin.address, destination.address);
          return { rideId: ride._id, price: calculatedPrice };
        } catch (error) {
          console.error("Error calculating price for ride:", ride._id, error);
          return { rideId: ride._id, price: 10 }; // Default fallback price
        }
      });

      // Wait for all price calculations and store them in state
      const prices = await Promise.all(pricePromises);
      const priceMap = {};
      prices.forEach(item => {
        priceMap[item.rideId] = item.price;
      });

      setRidePrices(priceMap);

    } catch (error) {
      console.error("Error fetching rides:", error);
      alert("Failed to fetch matching rides.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (rideId, price) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to book a ride.");
        return;
      }

      const finalPrice = ridePrices[rideId] || price; // Use calculated price or fallback to ride.pricePerSeat

      const response = await axios.post(
        "http://localhost:3000/bookings/new",
        { rideId, userId, price: finalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Ride booked successfully!");
        navigate('/home', {
          state: {
            showSnackbar: true,
            snackbarMessage: '🎉 Ride booked successfully!'
          }
        });
      } else {
        alert(response.data.message || "Booking failed.");
        navigate('/home', { state: { showSnackbar: true, snackbarMessage: '❌ Booking failed' } });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      //alert("All seats are booked. Try another ride");
      //navigate('/home')
    }
  };

  // Helper function to determine the final price to show
  const getFinalPrice = (ride) => {
    const calculatedPrice = ridePrices[ride._id];

    // If we have a calculated price
    if (calculatedPrice !== undefined) {
      // Return the lower of the two prices
      return ride.pricePerSeat < calculatedPrice ? ride.pricePerSeat : calculatedPrice;
    }

    // If we don't have a calculated price yet, just use the ride's price
    return ride.pricePerSeat;
  };

  return (
    <>
      <h2 style={{padding:'10px'}}>Find a Ride</h2>
      <div style={{ display:'flex', justifyContent:'space-between', gap:'10px',width:'100%',alignItems:'end'}}>
        <div style={{ margin: "0 10px 0 10px",padding:'10px',width:'40%' }}>
          <label style={{fontWeight:'500'}}>Origin:</label><br />
          <Autocomplete onLoad={(ref) => setOriginRef(ref)}>
            <input
              type="text"
              placeholder="Enter your origin"
              style={{ width: "100%", padding: "8px" }}
            />
          </Autocomplete>
        </div>

        <div style={{ margin: "0 10px 0 10px",padding:'10px',width:'40%'   }}>
          <label style={{fontWeight:'500'}}>Destination:</label><br />
          <Autocomplete onLoad={(ref) => setDestinationRef(ref)}>
            <input
              type="text"
              placeholder="Enter your destination"
              style={{ width: "100%", padding: "8px" }}
            />
          </Autocomplete>
        </div>

        <div style={{ margin: "0 10px 0 10px",padding:'10px',width:'20%'   }}>
          <button
            onClick={handleSearch}
            style={{
              fontWeight:'500',
              fontSize:'16px',
              width:'100%',
              height:'40px',
              backgroundColor: "#1CAC78",
              color: "#20201e",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Search Rides
          </button>
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 250px)',flexDirection:'column'}}>
            <CircularProgress style={{color:'#1CAC78'}} />
          </div>
        ) : rides.length === 0 ? (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 250px)',flexDirection:'column'}}>
            <img src="/No data-pana.png" width={'21%'}/>
            <span>No matching rides found.</span>
          </div>
        ) : (
          rides.map((ride) => {
            return (
              <div key={ride._id} style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <p><strong>From:</strong> {ride.origin}</p>
                <p><strong>To:</strong> {ride.destination}</p>
                <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                <p><strong>Seats:</strong> {ride.availableSeats}</p>
                <p><strong>Price:</strong> ₹{getFinalPrice(ride)}</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBooking(ride._id, getFinalPrice(ride))}
                >
                  Book ride
                </Button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default BookingPage;