// src/middleware/middleware.auth.js

const { appConfig, userRoles } = require("../config/const.config");
const jwt = require("jsonwebtoken");
const authSvc = require("../model/auth/auth.service");

const auth = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      // 1. Extract token
      let token = req.headers["authorization"] || req.headers["Authorization"];
      if (!token) {
        return res.status(401).json({
          message: "Token expected.",
          status: 401,
        });
      }

      if (token.toLowerCase().startsWith("bearer ")) {
        token = token.split(" ").pop();
      }

      // 2. Find session by masked token
      const session = await authSvc.getSessionDataUsingToken({
        "actualToken.maskedToken": token,
      });

      if (!session) {
        return res.status(401).json({
          message: "Invalid or expired token.",
          status: 401,
        });
      }

      // 3. Verify JWT
      const payload = jwt.verify(session.actualToken.actualToken, appConfig.web_token);

      if (payload.type !== "Bearer") {
        return res.status(403).json({
          message: "Invalid token type.",
          status: 403,
        });
      }

      // 4. Get user — THIS WAS YOUR LAST BUG
      const user = await authSvc.getSingleById(payload.sub);
      if (!user) {
        return res.status(404).json({
          message: "Account not found.",
          status: 404,
        });
      }

      // 5. FINAL FIX: ROLE CHECK THAT ACTUALLY WORKS
      const userRole = (user.role || "customer").toLowerCase(); // ← fallback + case-insensitive

      const hasAccess =
        !allowedRoles ||
        (Array.isArray(allowedRoles) &&
          allowedRoles.some((role) => role.toLowerCase() === userRole)) ||
        (typeof allowedRoles === "string" && allowedRoles.toLowerCase() === userRole);

      if (!hasAccess) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
          status: 403,
        });
      }

      // Optional: Block inactive users
      if (user.status !== "active") {
        return res.status(403).json({
          message: "Account is not activated.",
          status: 403,
        });
      }

      // 6. Attach user
      req.loggedInUser = authSvc.getMyProfile(user);
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Token expired or invalid.",
          status: 401,
        });
      }
      next(err);
    }
  };
};

module.exports = auth;