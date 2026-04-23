require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// 🔥 Security Middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

// 🔥 STRICT CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://splito-frontend.vercel.app" // Your exact production URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 🔥 Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/expenseRoutes"));
app.use("/api", require("./routes/balanceRoutes"));
app.use("/api", require("./routes/settlementRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// 🔥 MongoDB connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// 🔥 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
