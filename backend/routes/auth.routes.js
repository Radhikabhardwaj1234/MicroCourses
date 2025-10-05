// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const { register , login , logout, getMe} = require('../controllers/auth.controller');

// const auth = require('../middleware/auth.middleware');
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);
// router.get('/protected', auth, (req, res) => {
//   res.json({ message: `Hello ${req.user.name}, your role is ${req.user.role}` });
// });
module.exports = router;
