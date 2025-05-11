import React, { useState, useEffect } from "react";
import axios from "axios";

const BookRide = () => {
  const [rides, setRides] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/rides/available")
      .then(response => setRides(response.data))
      .catch(error => console.error("Error fetching rides:", error));
  }, []);

  const bookRide = (rideId) => {
    const token = localStorage.getItem("token"); // Get JWT from localStorage (or however you're storing it)
  
    axios.post("http://localhost:3000/bookings/new", { rideId }, {
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header
      }
    })
    .then(() => setBookingStatus("✅ Ride booked successfully!"))
    .catch((error) => {
      console.error("Error booking ride:", error);
      setBookingStatus("❌ Error booking ride");
    });
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Rides</h1>
      {bookingStatus && <p style={styles.status}>{bookingStatus}</p>}

      <div style={styles.grid}>
        {rides.map(ride => (
          <div key={ride._id} style={styles.card}>
            <p><strong>From:</strong> {ride.origin}</p>
            <p><strong>To:</strong> {ride.destination}</p>
            <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
            <p><strong>Price:</strong> ₹{ride.pricePerSeat}</p>
            <button onClick={() => bookRide(ride._id)} style={styles.button}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "2rem"
  },
  status: {
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#007b00"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out"
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default BookRide;
