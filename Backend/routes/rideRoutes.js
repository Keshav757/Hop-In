const express = require('express');
const router = express.Router();
const jwt=require('jsonwebtoken')
const rideController = require('../controllers/rideController');
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
router.post('/new-ride',verifyToken, rideController.createRide);
router.get('/available', rideController.getAllRides);
router.post('/match',rideController.matchRides)
router.get('/:userId',rideController.getRidesForUser)
router.delete("/delete/:rideId",rideController.deleteRide)
module.exports = router;
