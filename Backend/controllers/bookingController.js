const Booking = require('../models/booking.model');
const Ride = require('../models/ride.model');

// Book a ride
exports.bookRide = async (req, res) => {
    try {
      console.log("hi")
      console.log("inside api call");
      const { rideId, userId, price } = req.body;
      console.log("ride id:", rideId);
      console.log("userId:", userId);
  
      const ride1 = await Ride.findById(rideId);
      if (!ride1) {
        return res.status(404).json({ success: false, message: 'Ride not found' });
      }
  
      console.log("after searching ride");
      console.log("Available seats:", ride1.availableSeats);
  
      const seatsToBook = 1;
  
      // Prevent booking if fewer than 2 seats are available (e.g., only 1 or 0 left)
      if (ride1.availableSeats < 2) {
        return res.status(400).json({
          success: false,
          message: 'All seats booked or insufficient seats left. Try booking another ride.'
        });
      }
  
      // Create a new booking
      const booking = new Booking({
        ride: rideId,
        user: userId,
        seatsBooked: seatsToBook,
        totalCost: price,
        status: "pending"
      });
  
      await booking.save();
      console.log("after saving booking");
  
      // Update seat count
      ride1.availableSeats -= seatsToBook;
      await ride1.save(); // This will not cause a validation error because we blocked < 2 above
  
      return res.status(201).json({
        success: true,
        message: 'Booking successful',
        booking
      });
  
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({
        success: false,
        message: 'Server error while booking ride',
        error: error.message
      });
    }
  };
  

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        console.log("inside get booking")
        const { userId } = req.params
        if (!userId) return res.status(400).json({ error: "User ID is required" });
        console.log(userId)
        const bookings = await Booking.find({ user: userId }).populate('ride');
        res.status(200) .json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};