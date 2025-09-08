# Chat App Backend

A robust Node.js backend for a real-time chat application featuring authentication, real-time messaging, user profiles, and media uploads.

## Features

- **User Authentication**: Register, login, forgot password, OTP verification
- **User Profiles**: View and update profiles with ImageKit integration for photo uploads
- **Real-time Chat**: Instant messaging with Socket.io
- **Conversation Management**: Create and manage conversations
- **Message Status**: Delivered and read indicators
- **Typing Indicators**: Real-time typing notifications
- **Online Status**: Track user availability

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **ImageKit** - Image upload and management
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- ImageKit account (for media uploads)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sohit-mishra/Chat_Backend
cd Chat_Backend
```

2. Install dependencies:
```
npm install
```

3. Environment configuration:

- .env.example to .env 
- Update the environment variables with your actual values

```
cp .env.example .env
```

4. Configure your environment variables in .env:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=mySuperSecretKey123
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=test@gmail.com
EMAIL_PASS=TestPassword123
CLIENT_URL=http://localhost:3000
APP_NAME=ChatApp
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

5. Start the server:

```
# Development mode
npm run dev

# Production mode
npm start
```

## Access Server on Local Network

You can access your server from other devices on the same network:

1. Open CMD and run:

```bash
ipconfig
```

2. Find your IPv4 Address (e.g., 192.168.1.10)

3. Use it with the port number, for example:

http://192.168.1.10:4000

# API Documentation

## Authentication Endpoints

| Method | Endpoint               | Description               |
|--------|------------------------|---------------------------|
| POST   | /auth/register         | Register a new user       |
| POST   | /auth/login            | Login user                |
| POST   | /auth/forgot-password  | Request password reset    |
| POST   | /auth/reset-password   | Reset password            |
| POST   | /auth/verify-otp       | Verify OTP                |

## User Endpoints

| Method | Endpoint                 | Description             |
|--------|--------------------------|-------------------------|
| GET    | /users/me                | Get logged-in user profile |
| PUT    | /users/update/profile    | Update profile photo     |
| GET    | /users                   | Get all users            |
| PUT    | /users/update            | Update user details      |

## Conversation Endpoints

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| GET    | /conversations                  | Get all user conversations      |
| GET    | /conversations/:id/messages     | Get messages for a conversation |
| POST   | /conversations                  | Create a new conversation       |

## Socket.io Events

| Event           | Description                     |
|-----------------|---------------------------------|
| message:send    | Send a new message              |
| message:new     | Receive a new message           |
| messages:get    | Request message list for a conversation |
| messages:list   | Receive messages list           |
| typing:start    | Start typing indicator          |
| typing:stop     | Stop typing indicator           |
| message:read    | Mark a message as read          |
| users:online    | Online users update             |


## Support

- **LinkedIn**: [Connect me](https://www.linkedin.com/in/sohitmishra/)