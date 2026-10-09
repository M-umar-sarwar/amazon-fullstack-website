
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ============================================
// CORS — allow the GitHub Pages frontend
// ============================================

const allowedOrigins = new Set([
  "https://m-umar-sarwar.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
]);

// CORS headers must be set before routes and database handling.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  // Handle browser preflight requests.
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

// ============================================
// MONGODB CONNECTION
// ============================================

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
    throw new Error("MONGO_URI is missing.");
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

// ============================================
// HEALTH CHECKS
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "Amazon Clone API is running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// ============================================
// CONNECT DATABASE BEFORE PRODUCT REQUESTS
// ============================================

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

// ============================================
// PRODUCT ROUTES
// ============================================

app.use("/api/products", require("./productRoutes"));

// ============================================
// GENERAL ERROR HANDLER
// ============================================

app.use((error, req, res, next) => {
  console.error("API error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Internal server error"
  });
});

// ============================================
// LOCAL DEVELOPMENT
// ============================================

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ============================================
// VERCEL EXPORT
// ============================================

module.exports = app;
