import mongoose from "mongoose";

const InputSchema = new mongoose.Schema({
    questions: [{ question: String, answer: String }], // Store an array of Q&A
    createdAt: { type: Date, default: Date.now }
  });
  
  const InputData = mongoose.model("InputData", InputSchema);
  export default InputData;
