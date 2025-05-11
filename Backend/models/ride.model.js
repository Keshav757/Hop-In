const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  originPlaceId: {
    type: String,
    required: true
  }, 
  destinationPlaceId: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  vehicle: {
    type: String, // Vehicle model
    required: true
  },
  // bookings: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Booking'
  // }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;