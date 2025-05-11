const Booking = require('../models/booking.model');
const Ride = require('../models/ride.model');

// Book a ride
exports.bookRide = async (req, res) => {
    try {
        const { rideId } = req.body;

        if (!rideId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        const userId = req.user.id;  // ✅ Get user ID from the JWT payload
        const seatsBooked = 1;

        const booking = new Booking({
            ride: rideId,
            user: userId,
            seatsBooked,
            totalCost: ride.pricePerSeat * seatsBooked
        });

        await booking.save();

        ride.availableSeats -= seatsBooked;
        await ride.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const bookings = await Booking.find({ user: userId }).populate('ride');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
