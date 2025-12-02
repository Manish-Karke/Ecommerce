
import userValidator from "../../middleware/middleware.validate.js";
import {
  authValidatorLoginDTO,
  authValidatorRegistrationDTO,
} from "./auth.validator.js";
import express from "express"
import authCtrl from "./auth.controller.js";
import auth from "../../middleware/middleware.auth.js";
const userRouter =express.Router();

userRouter.post(
  "/register",
  userValidator(authValidatorRegistrationDTO),
  authCtrl.registerUser
);

userRouter.put("/activate/:id", authCtrl.activateUser)
userRouter.post('/login', userValidator(authValidatorLoginDTO), authCtrl.loginUser);
userRouter.get("/me", auth("admin"), authCtrl.getProfile)


export default userRouter;
