const { appConfig } = require("../config/config.config")

const auth = (allowedRoles = null) => {
    return async (req, res, next) => {
        try {
        let accessToken = req.headers['authorization']

        accessToken = accessToken.split(" ").pop()

        const token = await authSvs.getSingleByFilter({
            "actualToken.masked": accessToken
        })

        if(!token) {
            throw {
                status: 401,
                message: "Unathorization"
            }
        }

        const payload = jwt.verify(token.actualToken.actual, appConfig.jwtSecret);
        if(payload.type !== "Bearer") {
            throw {
                status: 403,
                message: "Access not expected"
            }
        }

        const userDetail = await userSvc.getTokenByFilter({
            _id: payload.sub
        })

        if(!userDetail) {
            throw {
                status: 403,
                message: "User doesn't exist anymore",
            }
        }

        if(allowedRoles === null || allowedRoles === Roles.ADMIN){
            req.loggedInUser = await userSvc.getUserProfile(userDetail);
            next()
        } else {
            throw {
                status: 403,
                message: "You are not allowed to access."
            }
        }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = auth