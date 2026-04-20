require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api", expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
