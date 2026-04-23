# Splito - Backend

The secure, high-performance API powering the Splito expense-tracking ecosystem.

## Features
- Secure Authentication: JWT-based stateless authentication with password hashing via Bcrypt.
- Expense Management: Full CRUD for tracking shared bills and payments.
- Real-time Balances: Complex logic to calculate who owes whom across the entire user base.
- Security Hardened: 
  - Helmet.js: Optimized HTTP headers for protection.
  - Express Rate Limit: Prevention against brute-force and DDoS attacks.
  - Strict CORS: Locked down to official production domains.

## Tech Stack
**Client:** React.js, Axios, Vanilla CSS
**Server:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Helmet.js, Express Rate Limit
**Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

## Environment Variables
Create a .env file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

## Installation
1. npm install
2. node server.js
