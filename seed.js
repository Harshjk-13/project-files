require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Exam = require('./models/Exam');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Exam.deleteMany({});

    const admin = await User.create({
      name: 'Dr. Kavita Nair',
      email: 'admin@exampulse.edu',
      password: 'Password123',
      role: 'admin'
    });

    await User.create({
      name: 'Aarav Sharma',
      email: 'student@exampulse.edu',
      password: 'Password123',
      role: 'student'
    });

    await Exam.create([
      {
        title: 'Full-Stack Web Engineering Assessment',
        subject: 'Computer Science',
        description: 'Covers React Hooks, REST APIs, MongoDB indexing, and JWT security.',
        durationMinutes: 30,
        passPercentage: 60,
        isPublished: true,
        createdBy: admin._id,
        questions: [
          {
            prompt: 'Which HTTP status code should a REST API return when a new resource is successfully created?',
            options: ['200 OK', '201 Created', '204 No Content', '400 Bad Request'],
            correctIndex: 1,
            explanation: '201 Created indicates the request succeeded and led to the creation of a resource.'
          },
          {
            prompt: 'Why is a cleanup function returned inside React useEffect?',
            options: [
              'To trigger an immediate re-render',
              'To clear timers, subscriptions, or WebSocket listeners on unmount',
              'To replace Redux state',
              'To compile JSX into HTML'
            ],
            correctIndex: 1,
            explanation: 'Cleanup functions prevent memory leaks by tearing down active intervals and listeners.'
          },
          {
            prompt: 'Which Mongoose feature replaces referenced ObjectIds with actual document fields?',
            options: ['.aggregate()', '.populate()', '.lean()', '.validate()'],
            correctIndex: 1,
            explanation: 'Mongoose .populate() automatically resolves ObjectId references from other collections.'
          }
        ]
      }
    ]);

    console.log('Seed completed successfully!');
    console.log('Admin Login:   admin@exampulse.edu / Password123');
    console.log('Student Login: student@exampulse.edu / Password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedDatabase();
