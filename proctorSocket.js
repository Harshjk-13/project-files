const activeCandidates = new Map();

const initProctorSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('proctor:join_admin', () => {
      socket.join('proctor_room');
      socket.emit('proctor:active_list', Array.from(activeCandidates.values()));
    });

    socket.on('exam:start', (payload) => {
      activeCandidates.set(socket.id, {
        socketId: socket.id,
        studentName: payload.studentName,
        examTitle: payload.examTitle,
        currentQuestion: 1,
        totalQuestions: payload.totalQuestions,
        warnings: 0,
        status: 'In Progress',
        joinedAt: new Date().toISOString()
      });
      io.to('proctor_room').emit('proctor:active_list', Array.from(activeCandidates.values()));
    });

    socket.on('exam:progress', ({ currentQuestion }) => {
      const candidate = activeCandidates.get(socket.id);
      if (candidate) {
        candidate.currentQuestion = currentQuestion;
        io.to('proctor_room').emit('proctor:active_list', Array.from(activeCandidates.values()));
      }
    });

    socket.on('proctor:violation', ({ studentName, examTitle, warnings }) => {
      const candidate = activeCandidates.get(socket.id);
      if (candidate) {
        candidate.warnings = warnings;
        io.to('proctor_room').emit('proctor:active_list', Array.from(activeCandidates.values()));
      }
      io.to('proctor_room').emit('proctor:alert', {
        id: Date.now(),
        studentName,
        examTitle,
        warnings,
        message: `Tab switch detected for ${studentName} (Warning #${warnings})`,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    socket.on('proctor:broadcast', ({ message }) => {
      io.emit('exam:announcement', {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    socket.on('disconnect', () => {
      if (activeCandidates.has(socket.id)) {
        activeCandidates.delete(socket.id);
        io.to('proctor_room').emit('proctor:active_list', Array.from(activeCandidates.values()));
      }
    });
  });
};

module.exports = initProctorSocket;
