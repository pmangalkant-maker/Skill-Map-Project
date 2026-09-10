import { dataStore } from "../services/dataStore.js";

/**
 * Role-Based Access Control Middleware
 * Protects routes by validating the authenticated user's role.
 * e.g. requireRole("recruiter") or requireRole("college_staff")
 */
export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please log in."
        });
      }

      const user = await dataStore.findUserById(req.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found."
        });
      }

      const rawRole = (user.role || "student").toLowerCase();
      let normalizedRole = rawRole;
      if (rawRole === "industry") normalizedRole = "recruiter";
      if (rawRole === "institution" || rawRole === "academician") normalizedRole = "college_staff";

      const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
      const isAllowed =
        normalizedAllowed.includes(normalizedRole) ||
        normalizedAllowed.includes(rawRole);

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: `Access denied. This endpoint is restricted to: ${allowedRoles.join(", ")}. Your current role is: ${rawRole}.`
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Role authorization error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal authorization check failed."
      });
    }
  };
}
