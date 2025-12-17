import mongoose from "mongoose";

const dynamicQuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    required: true,
    enum: ["text", "email", "number", "radio", "textarea", "select", "checkbox", "rating"]
  },
  options: {
    type: [String],
    default: []
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String
  },
  parentQuestionId: {
    type: String,
    default: null // null for initial questions, questionId for follow-ups
  },
  triggerAnswer: {
    type: String, // The answer that triggered this follow-up question
    default: null
  },
  order: {
    type: Number,
    required: true
  },
  isFollowUp: {
    type: Boolean,
    default: false
  }
});

const formResponseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const aiFormSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true
  },
  businessDescription: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  initialQuestions: [dynamicQuestionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const formSubmissionSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true
  },
  responses: [formResponseSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to avoid re-compiling
// Collection names: "forms" and "submissions"
export const AIForm = mongoose.models.AIForm || mongoose.model("AIForm", aiFormSchema, "forms");
export const FormSubmission = mongoose.models.FormSubmission || mongoose.model("FormSubmission", formSubmissionSchema, "submissions");

