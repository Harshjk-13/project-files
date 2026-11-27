const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedIndex: { type: Number, default: -1 },
        isCorrect: { type: Boolean, default: false }
      }
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    tabSwitches: { type: Number, default: 0 }
  },
  { timestamps: true }
);

submissionSchema.index({ exam: 1, student: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
