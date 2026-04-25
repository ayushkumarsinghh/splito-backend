# 🌌 Splito API — Financial Coordination Engine

Splito is a high-performance REST API designed to simplify shared finances. It manages complex debt relationships, group expenses, and real-time invitations with a focus on security and developer experience.

---

## ⚡ Core Features

- **Dynamic Group Ecosystem**: Create, manage, and invite members via a robust invitation workflow.
- **Real-time Balance Reconciliation**: Instant calculation of "who owes whom" across multiple groups.
- **Secure Financial Profiles**: Integrated UPI ID management for seamless peer-to-peer settlements.
- **Activity Tracking**: Comprehensive logging of every expense, payment, and group action.
- **Bulletproof Auth**: JWT-protected endpoints with granular access control.

---

## 🛠️ Technology Architecture

| Component | Technology |
| :--- | :--- |
| **Server** | Node.js with Express.js |
| **Data Layer** | MongoDB Atlas with Mongoose ODM |
| **Security** | JSON Web Tokens & Bcrypt hashing |
| **Deployment** | Scalable Vercel/Render Infrastructure |

---

## 🚀 Development Setup

### 1. Requirements
Ensure you have **Node.js 18+** and a **MongoDB** instance (local or Atlas) ready.

### 2. Installation
```bash
git clone https://github.com/ayushkumarsinghh/splito-backend.git
cd splito-backend
npm install
```

### 3. Environment Configuration
Define your credentials in a `.env` file:
```bash
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_signing_key
```

### 4. Boot the Server
```bash
# Development mode with hot-reloading
npm run dev

# Production build
npm start
```

---

## 🛣️ API Ecosystem

### 🔐 Authentication
- `POST /api/auth/register` - Onboard a new user
- `POST /api/auth/login` - Secure login & token generation

### 👤 User Management
- `GET /api/users/profile` - Retrieve account and settlement details
- `PUT /api/users/profile` - Update security credentials or UPI ID

### 👥 Group Operations
- `GET /api/groups` - Fetch all active memberships
- `POST /api/groups` - Initialize a new shared expense group
- `POST /api/groups/:groupId/invite` - Dispatch invitations to other users
- `DELETE /api/groups/:groupId/leave` - Graceful exit from a group

### 💸 Transaction Ledger
- `POST /api/expenses` - Log a new shared transaction
- `GET /api/expenses/history` - Comprehensive history of all splits
- `GET /api/balances` - Global summary of net financial standing
- `POST /api/settle` - Execute and record a debt clearance

---

## 📊 Data Logic Summary
The system utilizes four primary data entities to ensure consistency:
1. **Users**: The base identity with financial metadata.
2. **Groups**: Logical containers for shared spending.
3. **Expenses**: Transactional entries with automated split logic.
4. **Invitations**: State-managed onboarding for group collaboration.

---

## 🚢 Continuous Delivery
Integrated with **GitHub Actions** for automated testing and deployment. Every merge to `main` triggers a production rollout to ensure zero-downtime updates.
