import {
    addUser,
    deleteUser,
    doesUserExist,
    googleAuth,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updatePasswordUsingOldPassword,
    updateUserDetails,
    userDetails,
    verifyUser,
  } from "../controllers/userController.js";
  import { rateLimit } from "express-rate-limit";
  import moment from "moment";
  
  const generateMessage = (retryAfter) => {
    const retryTime = moment().add(retryAfter, "minutes").format("h:mm:ss A");
    return `Too many login attempts from this IP. Please try again after ${retryAfter} minutes at ${retryTime}.`;
  };
  
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: (req, res) => generateMessage(15),
  });
  
  const userRoutes = express.Router();
  
  userRoutes.post("/add-user",addUser);
  
  userRoutes.get("/doesUserExist", doesUserExist);
  
  userRoutes.post("/login", loginLimiter, loginUser);
  
  userRoutes.post("/logout", logoutUser);
  
  userRoutes.post("/refreshAccessToken", refreshAccessToken);
  
  userRoutes.post("/googleAuthentication", googleAuth);
  
  userRoutes.get("/verifyUser", verifyUser);
  
  userRoutes.get("/userDetails", userDetails);
  
  userRoutes.put(
    "/updateUser",
    updateUserDetails
  );
  
  userRoutes.patch(
    "/updatePasswordUsingOldPassword",
    updatePasswordUsingOldPassword
  );
  
  userRoutes.delete("/deleteUser", deleteUser);
  
  export default userRoutes;