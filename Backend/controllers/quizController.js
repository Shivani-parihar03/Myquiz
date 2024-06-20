const Quiz = require('../models/quiz');
const User = require('../models/user');
const Question = require('../models/Question');

exports.startQuiz = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questions = await Question.find().limit(15).exec();
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }

    const newQuiz = new Quiz({
      user: user._id,
      questions: questions,
    });

    const savedQuiz = await newQuiz.save();

    // Initialize the array if it doesn't exist
    if (!user.completedQuizzes) {
      user.completedQuizzes = [];
    }
    user.completedQuizzes.push(savedQuiz._id);
    await user.save();

    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += 1;
      }
    });

    quiz.score = score;
    quiz.completed = true;
    await quiz.save();

    res.status(200).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
