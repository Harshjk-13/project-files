const Exam = require('../models/Exam');
const Submission = require('../models/Submission');

exports.submitExam = async (req, res, next) => {
  try {
    const { examId, answers = {}, tabSwitches = 0 } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const evaluatedAnswers = exam.questions.map((q) => {
      const selected =
        answers[q._id.toString()] !== undefined ? Number(answers[q._id.toString()]) : -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionId: q._id,
        selectedIndex: selected,
        isCorrect
      };
    });

    const totalQuestions = exam.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= exam.passPercentage;

    const submission = await Submission.create({
      exam: exam._id,
      student: req.user._id,
      answers: evaluatedAnswers,
      score,
      totalQuestions,
      percentage,
      passed,
      tabSwitches
    });

    const io = req.app.get('io');
    if (io) {
      io.to('proctor_room').emit('proctor:submission', {
        studentName: req.user.name,
        examTitle: exam.title,
        percentage,
        passed,
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json({
      submission,
      reviewQuestions: exam.questions
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { student: req.user._id };
    const submissions = await Submission.find(filter)
      .populate('exam', 'title subject passPercentage questions')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};
