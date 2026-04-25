# Splito Backend
A premium expense-sharing and group bill-splitting REST API built with Node.js, Express, and MongoDB.

## Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose ODM)
*   **Auth**: JWT (JSON Web Tokens) with middleware protection
*   **Deployment**: Vercel / Render

## Project Structure
```text
src/
├── config/          # Database connection configuration
├── controllers/     # Route handlers (Auth, Group, Expense, etc.)
├── middleware/      # Auth protection and error handling
├── models/          # Mongoose schemas (User, Group, Expense, Invitation)
├── routes/          # API route definitions
└── server.js        # Main application entry point
```

## Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB Atlas account or local MongoDB instance

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ayushkumarsinghh/splito-backend.git
    cd splito-backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_API_URL=http://localhost:3000
```

### Database Setup
The application uses Mongoose. Ensure your `MONGO_URI` is correct, and the schemas will be automatically initialized on first run.

### Run in Development
```bash
npm run dev
```

### Build for Production
```bash
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |

### Users
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/api/users/profile` | Get current user profile | Yes |
| PUT | `/api/users/profile` | Update profile (UPI ID, password, etc.) | Yes |

### Groups
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/api/groups` | List all groups user is member of | Yes |
| POST | `/api/groups` | Create a new expense group | Yes |
| POST | `/api/groups/:groupId/invite` | Invite user via username | Yes |
| GET | `/api/invites` | Get pending group invitations | Yes |
| POST | `/api/invites/:inviteId/respond` | Accept/Reject invitation | Yes |
| DELETE | `/api/groups/:groupId/leave` | Leave a group | Yes |

### Expenses & Balances
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/expenses` | Add a new split expense | Yes |
| GET | `/api/expenses/history` | Get full expense history | Yes |
| GET | `/api/balances` | Get overall net balances | Yes |
| GET | `/api/groups/:groupId/balances` | Get group-specific balances | Yes |
| POST | `/api/settle` | Record a settlement payment | Yes |

## Database Schema
*   **User**: Profiles with username, email, password, and UPI ID for settlements.
*   **Group**: Shared containers for expenses with member lists and creator tracking.
*   **Expense**: Individual transaction records with split details and payer info.
*   **Invitation**: Tracking pending/accepted group invites between users.

## Deployment
Configured for automated deployment via GitHub Actions to Vercel/Render. Every push to the main branch triggers a production build.
