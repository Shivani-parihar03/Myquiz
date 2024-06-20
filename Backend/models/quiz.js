const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Quiz', QuizSchema);
