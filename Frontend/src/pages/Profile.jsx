import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import '../styles/Profile.css'; // Import the updated CSS

function Profile() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="profile-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>Profile</h1>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-role">{user.role}</p>

                <div className="profile-details">
                    <div><span>Email:</span> <span className="profile-email">{user.email}</span></div>
                    <div><span>Phone:</span> <span>{user.phone}</span></div>
                </div>

                <button className="profile-button">Edit Profile</button>
            </div>
        </div>
    );
}

export default Profile;
