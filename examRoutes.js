const express = require('express');
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getExams).post(authorizeRoles('admin'), createExam);

router
  .route('/:id')
  .get(getExamById)
  .put(authorizeRoles('admin'), updateExam)
  .delete(authorizeRoles('admin'), deleteExam);

module.exports = router;
