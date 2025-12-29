<<<<<<< HEAD
# EventHub
A full-stack web application for creating, viewing, and RSVPing to events. Built with the MERN stack (MongoDB, Express, React, Node.js). This project implements a robust concurrency handling system to prevent overbooking.
=======
# Mini Event Platform

A full-stack web application for creating, viewing, and RSVPing to events. Built with the MERN stack (MongoDB, Express, React, Node.js).
This project implements a robust concurrency handling system to prevent overbooking.

## Features

- **User Authentication**: Secure Login & Sign Up using JWT and BCrypt.
- **Event Management**: Create, Edit, Delete events with images.
- **RSVP System**: Join and Leave events with strict capacity enforcement.
- **Dashboard**: Search and Filter events by date.
- **Responsive Design**: Polished UI using Tailwind CSS, optimized for Mobile and Desktop.

## Technical Explanation: Concurrency Handling

To solve the "overbooking" challenge and race conditions when multiple users RSVP simultaneously to the last spot, I implemented **Atomic Database Updates** using MongoDB.

Instead of a "Read-Check-Write" pattern (which acts as a race condition window), I use a single atomic operation:

```javascript
const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] }, // Condition: Current attendees count < Capacity
  },
  {
    $addToSet: { attendees: userId }, // Action: Add user (prevent duplicates)
  },
  { new: true }
);
```

**Why this works:**
- MongoDB operations on a single document are atomic.
- The `$expr` condition ensures the update *only* applies if the capacity limit hasn't been reached *at the exact moment of the write*.
- If the condition fails (capacity reached), the operation returns `null`, allowing interaction to handle the "Full" state gracefully.

## Getting Started (Local)

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

### Installation

1.  **Clone the repository**
2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    - Create `.env` in `/server`:
      ```
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/mini-event-platform
      JWT_SECRET=your_jwt_secret
      ```
    - Create `.env` in `/client`:
      ```
      VITE_API_URL=http://localhost:5000/api
      ```

4.  **Run the Application**
    - **Backend**: `cd server && npm run dev`
    - **Frontend**: `cd client && npm run dev`

## Deployment

### Backend (Render/Railway)
1.  Push code to GitHub.
2.  New Web Service > Select Repository.
3.  Root Directory: `server`.
4.  Build Command: `npm install`.
5.  Start Command: `node server.js`.
6.  Add Environment Variables (`MONGO_URI`, `JWT_SECRET`).

### Frontend (Vercel/Netlify)
1.  Push code to GitHub.
2.  New Project > Select Repository.
3.  Root Directory: `client`.
4.  Build Command: `npm run build`.
5.  Output Directory: `dist`.
6.  Add Environment Variable: `VITE_API_URL` (Your deployed backend URL).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.
- **Tools**: JWT, Multer (Capacity for uploads planned).
>>>>>>> d1ab2b8 (chore: project init with gitignore)
