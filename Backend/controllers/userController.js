const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request body:", req.body);

        // Check if the email and password were provided
        if (!email || !password) {
            return res.status(400).json({
                error: "Please provide both email and password."
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ error: "Invalid email or password." });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ error: "Invalid email or password." });
        }
        console.log("JWT Secret:", process.env.JWT_SECRET);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send response with user details and token
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicle: user.vehicle // Include vehicle info if applicable
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role} = req.body;

        // Check for required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                error: "Please provide all required fields: name, email, password, and phone."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Use hashedPassword here
            phone,
            role,
        });

        await newUser.save();

        // Send response after saving the user
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
};
