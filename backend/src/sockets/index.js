// Sockets entry point
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('[Sockets] Client connected:', socket.id);

    socket.on('join_family', (familyId) => {
      socket.join(familyId);
      console.log(`[Sockets] Client ${socket.id} joined family room: ${familyId}`);
    });

    socket.on('disconnect', () => {
      console.log('[Sockets] Client disconnected:', socket.id);
    });
  });
};
