import jwt from "jsonwebtoken";

export const verifyOTP =  (otp, user) =>{
    const isMatch = user.otp === otp;
    const notExpired = user.otp && user.otpExpires > new Date();
    return isMatch && notExpired;
};


export const generateTokens = (userId) => {
    const accesstoken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const refreshtoken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    const refreshtokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {accesstoken, refreshtoken, refreshtokenExpires}

};