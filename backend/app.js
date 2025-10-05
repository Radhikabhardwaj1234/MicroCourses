// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db'); // DB connection (we'll create this next)
const adminRoutes = require('./routes/admin.routes');
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(helmet()); // security headers
app.use(cors({
  origin: "https://microcourses-frontend-4azj.onrender.com", // frontend URL, can update later
  credentials: true,               // allow cookies
}));
app.use(express.json());  // parse JSON request bodies
app.use(cookieParser());  // parse cookies
app.use(morgan('dev'));   // log requests


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/creators', require('./routes/creators.routes'));
app.use('/api/courses', require('./routes/courses.routes'));
app.use('/api/lessons', require('./routes/lessons.routes'));
app.use('/api/enroll', require('./routes/enroll.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/courses/:courseId/lessons', require('./routes/lessons.routes'));
app.use('/api/certificates', require('./routes/certificate.routes'));
app.use('/api/courses/:courseId/lessons/:lessonId/transcript', require('./routes/transcript.routes'));

// Root route
app.get('/', (req, res) => {
  res.send('MicroCourses API is running');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;



