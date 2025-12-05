const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/database");
const verifyFirebaseToken = require("./middleware/auth");

// Import routes
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const donationRoutes = require("./routes/donationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root route
app.get("/", verifyFirebaseToken, async (req, res) => {
  res.send("Server is running!");
});

// Initialize database and routes
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Use routes
    app.use(userRoutes);
    app.use(donorRoutes);
    app.use(donationRoutes);
    app.use(blogRoutes);
    app.use(contactRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
