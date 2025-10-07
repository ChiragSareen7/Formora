import User from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let accessToken, refreshToken;
  try {
    accessToken = user.generateAccessToken();
    refreshToken = user.generateRefreshToken();
  } catch (error) {
    throw new ApiError(500, `Error in generating tokens: ${error}`);
  }

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export default generateAccessTokenAndRefreshToken;