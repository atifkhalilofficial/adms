const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

router.get('/admin-only', protect, authorize('super_admin'), (req, res) => {
  res.json({ message: 'Welcome, admin. This is a restricted area.' });
});

module.exports = router;