const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Kynn Family Health OS Backend is running smoothly.' });
});

// Register routes (Placeholder)
// app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
// app.use('/api/v1/family', require('./modules/family/family.routes'));
// app.use('/api/v1/medications', require('./modules/medication/medication.routes'));

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
