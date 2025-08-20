import {
  readProfileService,
  refreshAccessTokenService,
  saveProfileService,
  userLoginService,
  userLogoutService,
  userRegisterService,
  userVerifyService,
} from "../services/userServices.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userRegisterService(email, password);
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went is wrong" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await userVerifyService(email, otp);

    res.cookie("refreshtoken", result.refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accesstoken", result.accesstoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went is wrong" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userLoginService(email, password);

    res.cookie("refreshtoken", result.refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accesstoken", result.accesstoken, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went is wrong" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshtoken } = req.body || req.cookie;
    const result = await refreshAccessTokenService(refreshtoken);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went is wrong" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshtoken = req.cookies?.refreshtoken;

    if (!refreshtoken) {
      return res
        .status(400)
        .json({ status: "fail", message: "No refresh token found" });
    }

    const result = await userLogoutService(req.user._id, refreshtoken);

    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");

    return res.status(200).json({ status: "success", ...result });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export const createProfile = async (req, res) => {
  const result = await saveProfileService(req);
  return res.status(200).json(result);
};

export const readProfile = async (req, res) => {
  const result = await readProfileService(req);
  return res.status(200).json(result);
};

export const updateProfile = async (req, res) => {
  const result = await saveProfileService(req);
  return res.status(200).json(result);
};
