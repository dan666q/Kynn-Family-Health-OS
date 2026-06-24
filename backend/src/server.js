const http = require('http');
const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const { initSocket } = require('./config/socket');

const PORT = env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect Database & Start Server
db.connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[Kynn Backend] Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[Kynn Backend] Database connection failed:', err);
    process.exit(1);
  });