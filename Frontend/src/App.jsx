import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import Authentication from './pages/authentication';
import HomePage from './pages/HomePage';
import AuthContext, { AuthProvider } from './context/authContext';
import RideContext, { RideProvider } from './context/rideContext';
import UserHomePage from './pages/user-home';
import Details from './pages/details';
import RideForm from './components/createRide';
import Profile from './pages/Profile'; // Import Profile page
import BookRide from './components/bookRide';
import BookingPage from './components/bookingForm';

function App() {
    const libraries = ['places'];
    
    return (
        <AuthProvider>
            <RideProvider>
                <LoadScript
                    googleMapsApiKey="AIzaSyCWdv5NBekZALcrzKGxS_SDciKzDywKr0o"
                    libraries={libraries}
                >
                    <Router>
                        <Routes>
                            <Route path="/Authentication" element={<Authentication />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/user-home" element={<UserHomePage />} />
                            <Route path="/vehicle-detail" element={<Details />} />
                            <Route path="/book-ride" element={<BookRide/>}/>
                            <Route path="/create-ride" element={<RideForm />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/matching" element={<BookingPage/>}/>

                            {/* Redirect based on authentication */}
                            <Route
                                path="/"
                                element={<ProtectedRoute />}
                            />
                        </Routes>
                    </Router>
                </LoadScript>
            </RideProvider>
        </AuthProvider>
    );
}

// Protected route to handle user redirection
const ProtectedRoute = () => {
    const { user } = useContext(AuthContext);
    return user ? <Navigate to="/user-home" /> : <HomePage />;
};

export default App;
