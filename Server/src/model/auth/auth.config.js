import { registerUser, loginUser, getAllUsers } from "./auth.service.js";
import userValidator from "../../middleware/middleware.validate.js";
import {
  authValidatorLoginDTO,
  authValidatorRegistrationDTO,
} from "./auth.validator.js";
import express from "express"
import authCtrl from "./auth.controller.js";
const userRouter =express.Router();

userRouter.post(
  "/register",
  userValidator(authValidatorRegistrationDTO),
  authCtrl.registerUser
);

userRouter.put("/activate/:token", authCtrl.activate)
userRouter.post('/login', userValidator(authValidatorLoginDTO), authCtrl.userLogin);
userRouter.get("/me", auth("admin"), authCtrl.getUserDetail)


export default userRouter;
