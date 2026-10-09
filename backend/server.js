
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow the GitHub Pages frontend
const allowedOrigins = new Set([
  "https://m-umar-sarwar.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-side tests.
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 204
};

// CORS must run before routes and database middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection cache for Vercel
const cached = global.mongooseCache ||
  (global.mongooseCache = {
    connection: null,
    promise: null
  });

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

// API home
app.get("/", (req, res) => {
  res.json({
    message: "Amazon Clone API is running"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Connect MongoDB before product requests
app.use("/api/products", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(500).json({
      error: "Database connection failed"
    });
  }
});

// Load product routes
app.use("/api/products", require("./productRoutes"));

// General error handler
app.use((error, req, res, next) => {
  console.error("API error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Internal server error"
  });
});

// Local development only
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
