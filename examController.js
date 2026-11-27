const Exam = require('../models/Exam');

exports.getExams = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isPublished: true };
    const exams = await Exam.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const sanitized = exams.map((exam) => {
      const obj = exam.toObject();
      if (req.user.role !== 'admin') {
        obj.questions = obj.questions.map(({ correctIndex, explanation, ...q }) => q);
      }
      return obj;
    });

    res.status(200).json(sanitized);
  } catch (error) {
    next(error);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (req.user.role !== 'admin' && !exam.isPublished) {
      return res.status(403).json({ message: 'This exam is not published yet' });
    }

    const obj = exam.toObject();
    if (req.user.role !== 'admin') {
      obj.questions = obj.questions.map(({ correctIndex, explanation, ...q }) => q);
    }

    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json(exam);
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
};
