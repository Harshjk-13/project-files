const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: [(arr) => arr.length >= 2, 'At least 2 options are required']
  },
  correctIndex: { type: Number, required: true, min: 0 },
  explanation: { type: String, default: '' }
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, min: 1, max: 300 },
    passPercentage: { type: Number, default: 60, min: 1, max: 100 },
    isPublished: { type: Boolean, default: false, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: [questionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
