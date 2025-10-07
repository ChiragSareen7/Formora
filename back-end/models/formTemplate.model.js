import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    unique: true
  },
  templateId: {
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
  fields: [
    {
      id: {
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
        enum: ["text", "email", "password", "number", "radio", "tel", "date", "textarea", "select", "checkbox"]
      },
      required: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String
      },
      minLength: {
        type: Number
      },
      maxLength: {
        type: Number
      },
      minValue: {
        type: Number
      },
      maxValue: {
        type: Number
      },
      options: {
        type: [String],
        default: []
      }
    }
  ],
  submitButtonText: {
    type: String,
    default: "Submit"
  },
  successMessage: {
    type: String,
    default: "Form submitted successfully!"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Form = mongoose.model("Form", formSchema);

export default Form;
