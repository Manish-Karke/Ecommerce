const { appConfig } = require("../config/const.config");

const auth = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      let accessToken = req.headers["authorization"];

      // 🔥 Added safety check
      if (!accessToken || !accessToken.startsWith("Bearer ")) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized: Token missing or invalid",
        });
      }

      // 🔥 Safe split
      accessToken = accessToken.split(" ")[1];

      const token = await authSvs.getSingleByFilter({
        "actualToken.masked": accessToken,
      });

      if (!token) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }

      const payload = jwt.verify(token.actualToken.actual, appConfig.jwtSecret);

      if (payload.type !== "Bearer") {
        return res.status(403).json({
          status: 403,
          message: "Access not expected",
        });
      }

      const userDetail = await userSvc.getTokenByFilter({
        _id: payload.sub,
      });

      if (!userDetail) {
        return res.status(403).json({
          status: 403,
          message: "User doesn't exist anymore",
        });
      }

      if (allowedRoles === null || allowedRoles === Roles.ADMIN) {
        req.loggedInUser = await userSvc.getUserProfile(userDetail);
        next();
      } else {
        return res.status(403).json({
          status: 403,
          message: "You are not allowed to access.",
        });
      }
    } catch (error) {
      console.log("Auth Error:", error);
      return res.status(error.status || 500).json({
        message: error.message || "Internal server error",
      });
    }
  };
};

module.exports = auth;
