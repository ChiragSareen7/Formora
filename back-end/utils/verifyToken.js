import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateAccessTokenAndRefreshToken from "./generateAccessAndRefreshToken.js";
import { ApiError } from "./ApiError.js";

const verifyTokens = async (accessToken, refreshToken) => {
  if (!accessToken) {
    return { isAuthenticated: false };
  }
  try {
    jwt.verify(accessToken, process.env.AccessToken_SECRET);
    return { isAuthenticated: true };
  } catch (error) {
    if (refreshToken) {
      try {
        const decodedToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken._id);

        if (!user || refreshToken !== user.refreshToken) {
          throw new ApiError(401, "Invalid refresh token");
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateAccessTokenAndRefreshToken(user._id);

        return {
          isAuthenticated: true,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } catch (refreshError) {
        return { isAuthenticated: false };
      }
    } else {
      return { isAuthenticated: false };
    }
  }
};

export default verifyTokens;