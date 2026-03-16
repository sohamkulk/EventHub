const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Check if the user is logged in by verifying their token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (without the password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Only allow specific roles to access certain routes
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

