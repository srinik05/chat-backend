# chat-backend

This is the backend server for the Chatting App, built with **Node.js**, **Express**, and **Socket.io**. It handles user authentication, chat messaging, and WebRTC signaling for voice calls.

## Features

- User registration and login (JWT authentication)
- Real-time chat using Socket.io
- Voice call signaling using WebRTC via Socket.io
- Modular and scalable architecture

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or cloud)

## Setup

1. Clone the repository:

```bash
git clone <your-backend-repo-url>
cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root folder:

env
Copy code
PORT=3000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
Run the server (development):

bash
Copy code
npm run dev
Run the server (production):

bash
Copy code
npm start
The server will run on http://localhost:3000.

Socket.io Events for Voice Calls
Event Name	Direction	Description
register	Client → Server	Register userId with socketId
call-user	Caller → Server → Callee	Send SDP offer to callee
incoming-call	Server → Callee	Notify callee of incoming call
answer-call	Callee → Server → Caller	Send SDP answer to caller
call-answered	Server → Caller	Notify caller that callee accepted
ice-candidate	Either direction	Exchange ICE candidates

Folder Structure
bash
Copy code
backend/
├── routes/          # API routes (auth, users)
├── controllers/     # Controller logic
├── models/          # MongoDB models
├── middleware/      # Authentication middleware
├── utils/           # Helper functions
├── server.js        # Main entry point
└── package.json
