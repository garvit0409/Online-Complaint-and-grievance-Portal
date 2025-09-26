// In server/routes/admin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// --- Hardcoded Admin Credentials (for demonstration) ---
// In a real application, fetch this from your database
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "password123";

// @route   POST /api/admin/login
// @desc    Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if credentials match
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Credentials are correct, create a token
    const payload = { user: { id: "admin" } }; // Simple payload
    const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });

    res.json({ success: true, token: token });
  } else {
    // Credentials are incorrect
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

module.exports = router;