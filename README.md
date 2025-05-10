# Carpooling App

## Overview
This is a MERN stack-based carpooling application that allows users to offer and book rides. It features user authentication, ride management, bookings, reviews, and real-time chat.

## Website Snapshot
![Project Preview](./Frontend/public/image.png)

## Features
- User authentication (login/register/logout)
- Create and manage rides
- Book rides
- Real-time chat between users
- Secure authentication with JWT
- Local and online MongoDB support

## Tech Stack
- **Frontend:** React, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Local and Cloud)
- **Authentication:** JWT
- **State Management:** Context API
- **Styling:** CSS

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/Keshav757/Hop-in.git
cd Hop-in
```

### 2. Install Dependencies
#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server` folder and add:
```
MONGO_URI_LOCAL=mongodb://localhost:27017/hopin
MONGO_URI_CLOUD=mongodb+srv://username:password@your-cluster.mongodb.net/hopin
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Start the Backend Server
```sh
cd server
npm start
```
This runs the backend on `http://localhost:3000`.

### 5. Start the Frontend
```sh
cd client
npm start
```
This runs the frontend on `http://localhost:5173` (or another port if configured).

## Usage
- Register or log in to your account.
- Offer a ride or book an available ride.
- View ride details, bookings, and reviews.
- Chat with other users.

## Troubleshooting
### Common Issues
- **MongoDB connection error**: Ensure MongoDB is running locally or use the correct cloud URI.
- **CORS issues**: If facing issues, modify `server.js` to include CORS middleware.
- **Token issues**: Make sure tokens are stored in `localStorage` and included in requests.

## Contributors
- Keshav Sai Rao Devulapally
- Manideep

## License
This project is licensed under the MIT License.
