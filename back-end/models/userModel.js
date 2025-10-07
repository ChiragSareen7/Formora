import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserData = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  password: { type: String, required: true },
}, { timestamps: true });

UserData.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = mongoose.model("User", UserData);
export default User;
