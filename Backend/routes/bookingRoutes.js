const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/new', bookingController.bookRide);
router.get('/:userId', bookingController.getUserBookings);

module.exports = router;
