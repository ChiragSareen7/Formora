const routes = express.Router();
import Form from '../models/formModel.js';                       
import User from '../models/userModel';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateAccessTokenAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import { cookieOptions } from "../config/cookiesConfig.js";
import generateRandomString from "../utils/randomString.js";
import verifyTokens from "../utils/verifyToken.js";
import jwt from "jsonwebtoken";

const addUser = asyncHandler(async (req, res, next) => {
  const { name, email, username, password, dob, gender, mobileNumber } =
    req.body;
  const fileLinks = req.fileLinks;

  //joi validation

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return next(
      new ApiError(409, "User with email or username already exists")
    );
  }

  if (!username) {
    const nameWithoutSpaces = name.replace(/\s+/g, "");
    const randomString = generateRandomString(3);
    username = nameWithoutSpaces + randomString;
  }

  const newUser = await User.create({
    name,
    email,
    username,
    password,
    dob,
    gender,
    mobileNumber,
    profileImage: fileLinks || null,
  });

  const createdUser = await User.findById(newUser._id)
    .select("-password -refreshToken -accessToken")
    .lean();

  if (!createdUser) {
    return next(
      new ApiError(500, "Something went wrong while registering the user.")
    );
  }
  console.log(`${createdUser.name} registered Successfully🎉`);

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(createdUser._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        `${createdUser.name} registered Successfully🎉`
      )
    );
});

const doesUserExist = asyncHandler(async (req, res, next) => {
  const { email } = req.query || req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, { userFound: false }, "User not found!"));
  }

  const foundUser = {
    profileImage: user.profileImage,
    username: user.username,
    name: user.name,
    email: user.email,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userFound: true, foundUser, isGoogleSignedUp: user.isGoogleSignedUp },
        "User found!"
      )
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();

  console.log(`${user.username} logged in successfully🎉`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        `${user.username} logged in successfully🎉`
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId),
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.RefreshToken_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used .");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const googleAuth = asyncHandler(async (req, res) => {
  const {
    displayName,
    email,
    photoURL,
    uid,
    emailVerified,
    metadata,
    phoneNumber,
  } = req.body;

  if (!emailVerified) {
    throw new ApiError(401, "Google mail not verified .");
  }

  let user = await User.findOne({ email });
  if (!user) {
    const nameWithoutSpaces = displayName.replace(/\s+/g, "");
    const randomString = generateRandomString(3);
    const username = nameWithoutSpaces + randomString;
    const newUser = new User({
      name: displayName,
      email,
      username: username,
      dob: "1990-05-15",
      gender: "other",
      password: uid + metadata.createdAt + process.env.GOOGEL_AUTH_PASS_SECRET,
      profileImage: [photoURL],
      mobileNumber: phoneNumber,
      isGoogleSignedUp: true,
    });

    user = await newUser.save();
  } else {
    const password =
      uid + metadata.createdAt + process.env.GOOGEL_AUTH_PASS_SECRET;
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully 🎉"
      )
    );
});

const verifyUser = asyncHandler(async (req, res) => {
  const accessToken =
    req.headers.authorization?.replace("Bearer ", "") || req.body.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const result = await verifyTokens(accessToken, refreshToken);

  if (result.isAuthenticated) {
    if (result.accessToken && result.refreshToken) {
      res.setHeader("Set-Cookie", [
        `accessToken=${result.accessToken}; ${cookieOptions}`,
        `refreshToken=${result.refreshToken}; ${cookieOptions}`,
      ]);
      return res.status(200).json(
        new ApiResponse(200, {
          isAuthenticated: true,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
    }
    return res.status(200).json(
      new ApiResponse(200, {
        isAuthenticated: true,
      })
    );
  } else {
    return res
      .status(401)
      .json(new ApiResponse(401, { isAuthenticated: false }));
  }
});

const userDetails = asyncHandler(async (req, res) => {
  const accessToken =
    req.headers.authorization?.replace("Bearer ", "") || req.body.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const verification = await verifyTokens(accessToken, refreshToken);

  if (verification.isAuthenticated) {
    try {
      const decodedToken = jwt.decode(accessToken || verification.accessToken);
      const userId = decodedToken._id;

      const user = await User.findById(userId)
        .select("-password -refreshToken -accessToken")
        .lean();

      if (!user) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
      }

      if (verification.accessToken && verification.refreshToken) {
        res.setHeader("Set-Cookie", [
          `accessToken=${verification.accessToken}; ${cookieOptions}`,
          `refreshToken=${verification.refreshToken}; ${cookieOptions}`,
        ]);
        return res.status(200).json(
          new ApiResponse(200, {
            user,
            accessToken: verification.accessToken,
            refreshToken: verification.refreshToken,
          })
        );
      } else {
        return res.status(200).json(new ApiResponse(200, { user }));
      }
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, `Error fetching user details: ${error}`));
    }
  } else {
    return res
      .status(401)
      .json(new ApiResponse(401, { isAuthenticated: false }));
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const accessToken =
    req.headers.authorization?.replace("Bearer ", "") || req.body.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const userDetailsToUpdate = req.body;
  if (req.fileLinks.length != 0) {
    userDetailsToUpdate.profileImage = req.fileLinks;
  }

  const verification = await verifyTokens(accessToken, refreshToken);

  if (verification.isAuthenticated) {
    try {
      const decodedToken = jwt.decode(accessToken || verification.accessToken);
      const userId = decodedToken._id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        userDetailsToUpdate,
        { new: true, select: "-password -refreshToken -accessToken" }
      ).lean();

      if (!updatedUser) {
        return res.status(404).json(new ApiResponse(404, "User not found"));
      }

      // Generate new tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await generateAccessTokenAndRefreshToken(userId);

      // Set new tokens in cookies
      res.setHeader("Set-Cookie", [
        `accessToken=${newAccessToken}; ${cookieOptions}`,
        `refreshToken=${newRefreshToken}; ${cookieOptions}`,
      ]);

      return res.status(200).json(
        new ApiResponse(200, {
          user: updatedUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error updating user details"));
    }
  } else {
    return res
      .status(401)
      .json(new ApiResponse(401, { isAuthenticated: false }));
  }
});

const updatePasswordUsingOldPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required.");
  }

  const accessToken =
    req.headers.authorization?.replace("Bearer ", "") || req.body.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const verification = await verifyTokens(accessToken, refreshToken);

  if (!verification.isAuthenticated) {
    return res
      .status(401)
      .json(new ApiResponse(401, { isAuthenticated: false }, "Unauthorized."));
  }

  try {
    const decodedToken = jwt.decode(accessToken || verification.accessToken);
    const userId = decodedToken._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (isOldPasswordCorrect) {
      user.password = newPassword;
      await user.save();
    } else {
      throw new ApiError(401, "Current password is incorrect!");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Password updated successfully."));
  } catch (error) {
    throw new ApiError(400, error.message || error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const accessToken =
    req.headers.authorization?.replace("Bearer ", "") || req.body.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const verification = await verifyTokens(accessToken, refreshToken);

  if (verification.isAuthenticated) {
    const decodedToken = jwt.decode(accessToken || verification.accessToken);
    const userId = decodedToken._id;

    const user = await User.findByIdAndDelete(userId).lean();

    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    res.setHeader("Set-Cookie", [
      `accessToken=; ${cookieOptions}`,
      `refreshToken=; ${cookieOptions}`,
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully"));
  } else {
    return res
      .status(401)
      .json(new ApiResponse(401, { isAuthenticated: false }));
  }
});

export {
  addUser,
  doesUserExist,
  loginUser,
  logoutUser,
  refreshAccessToken,
  googleAuth,
  verifyUser,
  userDetails,
  updateUserDetails,
  deleteUser,
  updatePasswordUsingOldPassword,
};