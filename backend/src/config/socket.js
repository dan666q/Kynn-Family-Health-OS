const { Server } = require('socket.io');
const socketHandler = require('../sockets');

let io;

module.exports = {
  initSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    console.log('[Kynn Socket] Socket.IO server initialized successfully.');
    
    // Bind socket event handlers
    socketHandler(io);
    
    return io;
  },
  getIO: () => {
    if (!io) {
      console.warn('[Kynn Socket] Socket.IO not initialized yet');
    }
    return io;
  }
};

