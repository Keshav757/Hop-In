
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

exports.authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Attach user to request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};