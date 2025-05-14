import React, { useContext, useState } from 'react';
import AuthContext from '../context/authContext';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [rides, setRides] = useState([]);
    const [showBookings, setShowBookings] = useState(false);
    const [showRides, setShowRides] = useState(false);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/bookings/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(response.data);
            setShowBookings((prev) => !prev);  // Toggle display
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchCreatedRides = async () => {
        if (!user) {
            console.log("no uder id")
            return;
        }
        try {
            const token = localStorage.getItem('token');
            console.log("token:",token)
            console.log("user id:",user.id)
            const response = await axios.get(`http://localhost:3000/rides/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRides(response.data);
            console.log(rides.length)
            setShowRides((prev) => !prev);  // Toggle display
        } catch (error) {
            console.error('Error fetching created rides:', error);
        }
    };

    const deleteRide = async (rideId) => {
        try {
            const token = localStorage.getItem('token');
    
            const response = await axios.delete(`http://localhost:3000/rides/delete/${rideId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log(response.data.message); // Optional: show confirmation
        } catch (error) {
            console.error('Error deleting ride:', error);
        }
    };
    
    if (!user) {
        return <div className="profile-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>Profile</h1>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-role">{user.role}</p>

                <div className="profile-details">
                    <div><span>Email:</span> <span className="profile-email">{user.email}</span></div>
                    <div><span>Phone:</span> <span>{user.phone}</span></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
    <button className="profile-button" onClick={fetchBookings}>
        {showBookings ? "Hide Bookings" : "See Bookings"}
    </button>
    
    <button className="profile-button" onClick={fetchCreatedRides}>
        {showRides ? "Hide My Created Rides" : "See My Created Rides"}
    </button>
</div>

            </div>

            {showBookings && (
                <div className="profile-bookings">
                    <h2>Your Bookings</h2>
                    {bookings.length === 0 ? (
                        <p>No bookings yet.</p>
                    ) : (
                        <ul>
                            {bookings.map((booking) => (
                                <li key={booking._id} className="booking-item">
                                    <p><strong>From:</strong> {booking.ride?.origin}</p>
                                    <p><strong>To:</strong> {booking.ride?.destination}</p>
                                    <p><strong>Date:</strong> {new Date(booking.ride?.createdAt).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showRides && (
                <div className="profile-bookings">
                    <h2>Your Created Rides</h2>
                    {rides.length === 0 ? (
                        <p>No rides created yet.</p>
                    ) : (
                        <ul>
                            {rides.map((ride) => (
                                <li key={ride._id} className="booking-item">
                                    <p><strong>From:</strong> {ride.origin}</p>
                                    <p><strong>To:</strong> {ride.destination}</p>
                                    <p><strong>Date:</strong> {new Date(ride.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
                                    <p><strong>Price:</strong> ₹{ride.pricePerSeat}</p>
                                    <button className="profile-button" onClick={() => deleteRide(ride._id)}>
                                        Delete Ride
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;
