import React, { createContext, useState } from 'react';
import axios from 'axios';

const RideContext = createContext();

export const RideProvider = ({ children }) => {
    const [rides, setRides] = useState([]);

    const createRide = async (rideData) => {
        try {
            const token = localStorage.getItem('token'); // Get token
            if (!token) throw new Error('No token found');
    
            const response = await axios.post('http://localhost:3000/rides/new-ride', rideData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Ensure correct format
                }
            });
    
            console.log('Ride created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating ride:', error.response?.data || error.message);
            throw error;
        }
    };
    

    return (
        <RideContext.Provider value={{ rides, createRide }}>
            {children}
        </RideContext.Provider>
    );
};

export default RideContext;
