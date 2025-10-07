import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    name: String,
    value: Number,
    createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", dataSchema);
export default Data;
