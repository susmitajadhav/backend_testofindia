//routes/authRoute.js
const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const router = express.Router();

// Registration route
router.post('/signup', registerUser);

// Login route
router.post('/login', loginUser);

// Get all users route (new route)
router.get('/users', getAllUsers);

module.exports = router;
