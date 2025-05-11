const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const jwt=require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token =req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).send('Access denied');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // User's data is available in req.user
        console.log("User",decoded)
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

router.post('/new', verifyToken, bookingController.bookRide);
router.get('/:userId', verifyToken, bookingController.getUserBookings);

module.exports = router;
