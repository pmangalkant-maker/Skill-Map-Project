import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing. Please define JWT_SECRET in your .env configuration.");
  }
  return secret;
}

export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required. Please log in."
    });
  }

  const token = header.split(" ")[1];
  if (!token || !token.trim()) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing."
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload."
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: isExpired ? "Your session has expired. Please log in again." : "Invalid authentication token."
    });
  }
}
