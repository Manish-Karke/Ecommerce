import { registerUser, loginUser, getAllUsers } from "./auth.service.js";
import userValidator from "../../middleware/middleware.validate.js";
import {
  authValidatorLoginDTO,
  authValidatorRegistrationDTO,
} from "./auth.validator.js";
import express from "express"
const userRouter =express.Router();

userRouter.post(
  "/register",
  userValidator(authValidatorRegistrationDTO),
  registerUser
);
userRouter.post("/login", userValidator(authValidatorLoginDTO), loginUser);
userRouter.get("/users", getAllUsers);

export default userRouter;
