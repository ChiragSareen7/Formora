import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
    summary: Object,
    inputId: { type: mongoose.Schema.Types.ObjectId, ref: "InputData" },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Summary = mongoose.model("Summary", SummarySchema);
  export default Summary;


