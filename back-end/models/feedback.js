import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    questions: [
      {
        question: String,
        answer: mongoose.Schema.Types.Mixed
      }
    ],
    summary: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);
  
  export default Feedback;
