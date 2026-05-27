const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token extracted:", token ? "Present" : "Missing");

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      console.log("Token decoded successfully for user ID:", decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("User not found for ID:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("User authenticated:", req.user.email);
      return next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  console.log("No authorization header or Bearer token found");
  return res.status(401).json({ message: "Not authorized, no token" });
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("Admin access granted for:", req.user.email);
    next();
  } else {
    console.log("Admin access denied for:", req.user?.email || "unknown user");
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
