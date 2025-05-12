import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Autocomplete } from "@react-google-maps/api";
import { Button ,CircularProgress} from "@mui/material";


const BookingPage = () => {
  const [originRef, setOriginRef] = useState(null);
  const [destinationRef, setDestinationRef] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const storage=window.localStorage;
  const user=JSON.parse(storage.getItem('user'));
  const userId=user?.id
  const handleSearch = async () => {
    const originPlace = originRef?.getPlace();
    const destinationPlace = destinationRef?.getPlace();
    console.log(originPlace)
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
    } catch (error) {
      console.error("Error fetching rides:", error);
      alert("Failed to fetch matching rides.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (rideId, price) => {
    try {
      console.log(rideId);
      console.log(userId);
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("You must be logged in to book a ride.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:3000/bookings/new",
        { rideId, userId, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("Ride booked successfully!");
        // Pass message to homepage
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
      alert("All seats are booked. Try another ride");
      navigate('/home')
    }
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
          rides.map((ride) => (
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
              <p><strong>Price:</strong> ₹{ride.pricePerSeat}</p>
              <Button variant="contained" color="primary" onClick={()=> handleBooking(ride._id,ride.pricePerSeat)}>Book ride</Button> 
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default BookingPage;
