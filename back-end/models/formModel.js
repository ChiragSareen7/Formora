import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
});

const formSchema = new mongoose.Schema({
    questions: {
        type: [questionSchema],
        required: true,
    }
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
