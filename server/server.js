const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

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

const app = express();

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

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mern-ecommerce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
    createDemoUsers();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const createDemoUsers = async () => {
  try {
    const User = require("./models/User");

    // Check if demo users exist
    const adminUser = await User.findOne({ email: "admin@shopease.com" });
    const regularUser = await User.findOne({ email: "john@example.com" });

    if (!adminUser) {
      await User.create({
        name: "Admin User",
        email: "admin@shopease.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Demo admin user created");
    }

    if (!regularUser) {
      await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "user123",
        role: "user",
      });
      console.log("Demo regular user created");
    }
  } catch (error) {
    console.error("Error creating demo users:", error);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running successfully!",
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
