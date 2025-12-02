// src/middleware/middleware.auth.js   (or wherever it lives)

const { appConfig, userRoles } = require("../config/const.config");
const jwt = require("jsonwebtoken");
const authSvc = require("../model/auth/auth.service");

const auth = (allowedRoles = null) => {
    return async (req, res, next) => {
        try {
            // 1. Get token from header
            let token = req.headers["authorization"] || req.headers["Authorization"] || null;

            if (!token) {
                return res.status(401).json({
                    message: "Token expected.",
                    status: 401,
                });
            }

            // Remove "Bearer " prefix if exists
            if (token.toLowerCase().startsWith("bearer ")) {
                token = token.split(" ").pop();
            }

            // 2. Find session using masked token
            const sessionDetail = await authSvc.getSessionDataUsingToken({
                "actualToken.maskedToken": token,
            });

            if (!sessionDetail) {
                return res.status(401).json({
                    message: "Invalid or expired token.",
                    status: 401,
                });
            }

            // 3. Verify actual JWT
            const payload = jwt.verify(sessionDetail.actualToken.actualToken, appConfig.web_token);

            // 4. Token type check
            if (payload.type !== "Bearer") {
                return res.status(403).json({
                    message: "Invalid token type. Bearer token required.",
                    status: 403,
                });
            }

            // 5. Get user by ID (THIS WAS THE HIDDEN BUG)
            const userDetails = await authSvc.getSingleById(payload.sub); // ← pass string, not object!

            if (!userDetails) {
                return res.status(404).json({
                    message: "Account not found.",
                    status: 404,
                });
            }

            // 6. Role authorization check
            const hasAccess =
                !allowedRoles ||
                allowedRoles === userRoles.CUSTOMER ||
                (Array.isArray(allowedRoles) && allowedRoles.includes(userDetails.role));

            if (!hasAccess) {
                return res.status(403).json({
                    message: "You are not authorized to access this resource.",
                    status: 403,
                });
            }

            // 7. Attach user to request
            req.loggedInUser = authSvc.getMyProfile(userDetails);
            next();
        } catch (err) {
            // Any unexpected error (jwt expired, malformed, etc.)
            if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Invalid or expired token.",
                    status: 401,
                });
            }
            next(err); // Let global error handler deal with it
        }
    };
};

module.exports = auth;