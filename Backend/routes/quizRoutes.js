const express = require('express');
const { startQuiz, submitQuiz } = require('../controllers/quizController');
const checkAuth = require("../middleware/auth");
const router = express.Router();

router.post('/start', startQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
