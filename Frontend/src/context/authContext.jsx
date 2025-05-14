import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user and token from localStorage on app load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(storedUser);
        }
        console.log('Loaded Token:', token);
    }, []);

    // Update localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        console.log('Updated Token:', localStorage.getItem('token'));
    }, [user]);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token); // Ensure token is stored
            console.log('Login Success - Token Stored:', data.token);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (name, email, password, phone, role) => {
        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone, role }),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
             // Ensure token is stored
            console.log('Registration Success - Token Stored:', data.token);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        console.log('User logged out - Token removed');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
