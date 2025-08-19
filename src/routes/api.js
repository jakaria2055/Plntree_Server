import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyUser,
} from "../controller/userController.js";
import { auth } from "../middleware/authenticationMiddleware.js";

const router = express.Router();

//USER AUTHENTICATION ROUTER
router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.post("/user/refresh", refreshAccessToken);
router.post("/user/logout",auth, logoutUser);

export default router;
