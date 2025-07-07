const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(cors({ origin: "*" })); // Allow all origins (for dev)
app.use(express.json());         // Parse JSON bodies

// Routes
const memberRoutes = require("./routes/memberRoutes");
app.use("/api/members", memberRoutes);

// MongoDB Connection + Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
