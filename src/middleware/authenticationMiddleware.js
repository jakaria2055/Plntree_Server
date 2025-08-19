import jwt from "jsonwebtoken";
import UserModel from "../model/userModel.js";


export const auth = async (req, res, next) => {
  try {
    const accesstoken = req.cookies?.accesstoken || req.header("accesstoken");


    if (!accesstoken) {
      const error = new Error("Authorization failed.");
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET);
    const user = await UserModel.findById({ _id: decoded.userId });

    if (!user) {
      const error = new Error("Authorization failed.");
      error.statusCode = 400;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please verify the user");
      error.statusCode = 400;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    const err = new Error("Something went is wrong (in userAuthMiddleware)");
    err.statusCode = 400;
    throw err;
  }
};
