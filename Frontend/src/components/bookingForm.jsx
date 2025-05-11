import React, { useState } from "react";
import axios from "axios";
import { Autocomplete } from "@react-google-maps/api";

const BookingPage = () => {
  const [originRef, setOriginRef] = useState(null);
  const [destinationRef, setDestinationRef] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

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
  

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Find a Ride</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Origin:</label><br />
        <Autocomplete onLoad={(ref) => setOriginRef(ref)}>
          <input
            type="text"
            placeholder="Enter your origin"
            style={{ width: "300px", padding: "8px" }}
          />
        </Autocomplete>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Destination:</label><br />
        <Autocomplete onLoad={(ref) => setDestinationRef(ref)}>
          <input
            type="text"
            placeholder="Enter your destination"
            style={{ width: "300px", padding: "8px" }}
          />
        </Autocomplete>
      </div>

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Search Rides
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>Matching Rides</h3>
        {loading ? (
          <p>Loading...</p>
        ) : rides.length === 0 ? (
          <p>No matching rides found.</p>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingPage;
