import mongoose from "mongoose";

const CrossFormAnalysisSummarySchema = new mongoose.Schema({
    summary: Object,
    createdAt: { type: Date, default: Date.now }
});

const CrossFormAnalysisSummary = mongoose.model("CrossFormAnalysisSummary", CrossFormAnalysisSummarySchema);
export default CrossFormAnalysisSummary;