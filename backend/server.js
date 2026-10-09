
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Cache the MongoDB connection across warm Vercel requests
const cached = global.mongooseCache ||
  (global.mongooseCache = {
    connection: null,
    promise: null
  });

async function connectDB() {
  if (
    cached.connection &&
    mongoose.connection.readyState === 1
  ) {
    return cached.connection;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((instance) => instance)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

// Test the API
app.get("/", (req, res) => {
  res.json({ message: "Amazon Clone API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB before accessing product routes
app.use("/api/products", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(500).json({
      error: "Database connection failed. Check MONGO_URI and MongoDB Atlas access."
    });
  }
});

// Load product routes
app.use("/api/products", require("./productRoutes"));

// Return readable errors instead of an unhandled exception
app.use((error, req, res, next) => {
  console.error("API error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({ error: "Internal server error" });
});

// Local development only; Vercel handles requests itself
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;
