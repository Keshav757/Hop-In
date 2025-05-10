const Ride = require('../models/ride.model');  
const Booking = require('../models/booking.model');  
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

exports.createRide = async (req, res) => {
    const { origin, destination, departureTime, availableSeats, pricePerSeat, vehicle } = req.body;
    // Validate required fields
    if (!origin || !destination || !departureTime || !availableSeats || !pricePerSeat || !vehicle) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newRide = new Ride({
        driver: req.user.id,  // Use the user ID from the decoded token
        origin,
        destination,
        departureTime,
        availableSeats,
        pricePerSeat,
        vehicle
    });

    try {
        await newRide.save();
        res.status(201).json(newRide);
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Error creating ride', error: error.message });
    }
};


// Get all rides
exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.status(200).json(rides);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};