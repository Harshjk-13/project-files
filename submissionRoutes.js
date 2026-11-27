const express = require('express');
const { submitExam, getSubmissions } = require('../controllers/submissionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getSubmissions);
router.post('/', authorizeRoles('student'), submitExam);

module.exports = router;
