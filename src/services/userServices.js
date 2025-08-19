import bcrypt from "bcryptjs";
import UserModel from "../model/userModel.js";
import { sendOTPtoEmail } from "../utils/mailer.js";
import { generateTokens, verifyOTP } from "../utils/helper.js";

export const userRegisterService = async (email, password) => {
  if (!email || !password) {
    const error = new Error("E-mail and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const existUser = await UserModel.findOne({ email });

  if (existUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
    otp,
    otpExpires,
  });

  await newUser.save();

  await sendOTPtoEmail(email, otp);

  return {
    status: "success",
    message: "Registration successful",
  };
};

export const saveOTPtoUser = async (email, otp, otpExpires, hashedPassword) => {
  return await UserModel.findOneAndUpdate(
    { email },
    {
      otp: otp,
      otpExpires: otpExpires,
      password: hashedPassword,
    },
    { new: true }
  );
};

export const userVerifyService = async (email, otp) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }

  if (!verifyOTP(otp, user)) {
    const error = new Error("Invalid or OTP Expired");
    error.statusCode = 400;
    throw error;
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;

  const { accesstoken, refreshtoken, refreshtokenExpires } = generateTokens(
    user?._id
  );

  user.refreshtoken.push({
    token: refreshtoken,
    expiresAt: refreshtokenExpires,
  });

  await user.save();

  return {
    status: "success",
    accesstoken,
    refreshtoken,
    message: "User verified successfully.",
  };
};

export const userLoginService = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("User Not Found");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid Credential");
    error.statusCode = 400;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("please Verify your email.");
    error.statusCode = 400;
    throw error;
  }

  const { accesstoken, refreshtoken, refreshtokenExpires } = generateTokens(
    user?._id
  );

  user.refreshtoken.push({
    token: refreshtoken,
    expiresAt: refreshtokenExpires,
  });

  await user.save();

  return {
    status: "success",
    accesstoken,
    refreshtoken,
    message: "User Login successfully.",
  };
};

export const refreshAccessTokenService = async (refreshtoken) => {
  if (!refreshtoken) {
    const error = new Error("Refresh Error!");
    error.statusCode = 400;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshtoken, process.env.JWT_SECRET);
  } catch (error) {
    const err = new Error("Invalid Token!");
    err.statusCode = 400;
    throw err;
  }

  const user = await UserModel.findOne({
    _id: decoded.userId,
    "refreshtoken.token": refreshtoken,
    "refreshtoken.expiresAt": { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("Refresh Expired!");
    error.statusCode = 400;
    throw error;
  }

  const { accesstoken } = generateTokens(user?._id);

  return { accesstoken };
};

export const userLogoutService = async (userId, refreshtoken) => {
  await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { refreshtoken: { token: refreshtoken } } },
    { new: true } // return updated document if needed
  );

  return { message: "User logged out successfully!" };
};
