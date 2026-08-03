import mongoose from 'mongoose';

const MCQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
  explanation: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  questions: [MCQSchema],
  originalFileName: { type: String, required: true },
  score: { type: Number, default: 0 }, // User score if you allow attempts
attempted: { type: Boolean, default: false }, // Has the quiz been taken?
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
export default Quiz; 