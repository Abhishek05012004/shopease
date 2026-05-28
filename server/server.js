const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const paymentsRoutes = require("./routes/payments");
const recommendationsRoutes = require("./routes/recommendations");
const analyticsRoutes = require("./routes/analytics");
const contactRoutes = require("./routes/contact");

const app = express();

// Secure HTTP headers
app.use(helmet());

// Prevent NoSQL query injection
app.use(mongoSanitize());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isConnected = false;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  console.log("Connecting to MongoDB...");
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mern-ecommerce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  if (!isConnected) {
    console.log("MongoDB connected successfully");
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection middleware error:", err);
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// Rate limiting for auth and payment routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});

// Routes
app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", apiLimiter, paymentsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contact", contactRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running successfully!",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "ShopEase Backend API is running successfully!",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
