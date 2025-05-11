const Ride = require('../models/ride.model');  
const Booking = require('../models/booking.model');  
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const { Client } = require('@googlemaps/google-maps-services-js');
const polyline = require('@mapbox/polyline');
const client = new Client({});

exports.createRide = async (req, res) => {
    const { origin, originPlaceId, destination, destinationPlaceId, departureTime, availableSeats, pricePerSeat, vehicle } = req.body;
    // Validate required fields
    if (!origin || !destination || !departureTime || !availableSeats || !pricePerSeat || !vehicle || !originPlaceId || !destinationPlaceId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newRide = new Ride({
        driver: req.user.id,  // Use the user ID from the decoded token
        origin,
        originPlaceId,
        destination,
        destinationPlaceId,
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


const GOOGLE_API_KEY = "AIzaSyDBUN4PfqDgLunQEbsZVsxslaraGmgtnqg";
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

exports.matchRides = async (req, res) => {
    const { origin, destination } = req.body;

    if (!origin?.place_id || !destination?.place_id) {
        return res.status(400).json({ message: 'Origin and destination place_id are required' });
    }
    console.log(origin?.place_id)
    try {
        // Get coordinates of user origin/destination
        const [originGeoResp, destinationGeoResp] = await Promise.all([
            client.geocode({ params: { place_id: origin.place_id, key: GOOGLE_API_KEY } }),
            client.geocode({ params: { place_id: destination.place_id, key: GOOGLE_API_KEY } }),
        ]);

        if (!originGeoResp.data.results.length || !destinationGeoResp.data.results.length) {
            return res.status(400).json({ message: 'Invalid origin or destination' });
        }

        const userOrigin = originGeoResp.data.results[0].geometry.location;
        const userDestination = destinationGeoResp.data.results[0].geometry.location;

        const rides = await Ride.find({});
        const matchingRides = [];
        console.log('found rides')
        for (const ride of rides) {
            const directions = await client.directions({
                params: {
                    origin: `place_id:${ride.originPlaceId}`,
                    destination: `place_id:${ride.destinationPlaceId}`,
                    key: GOOGLE_API_KEY,
                },
            });

            const route = directions.data.routes[0];
            if (!route || !route.overview_polyline) continue;

            let points;
            try {
                points = polyline.decode(route.overview_polyline.points);
            } catch (decodeError) {
                console.error('Failed to decode polyline:', decodeError.message);
                continue;
            }

            const isOriginNear = points.some(([lat, lng]) => 
                getDistanceFromLatLonInKm(lat, lng, userOrigin.lat, userOrigin.lng) < 3
            );
            const isDestinationNear = points.some(([lat, lng]) => 
                getDistanceFromLatLonInKm(lat, lng, userDestination.lat, userDestination.lng) < 3
            );
            console.log(isOriginNear,isDestinationNear)
            if (isOriginNear && isDestinationNear) {
                matchingRides.push(ride);
            }
        }

        res.status(200).json(matchingRides);

    } catch (error) {
        console.error("Error in matchRides:", error.response?.data || error.message);
        return res.status(500).json({
            message: 'Something went wrong with matching rides',
            error: error.response?.data?.error_message || error.message,
        });
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