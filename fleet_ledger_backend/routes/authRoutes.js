const express = require('express');
const passport = require('passport');
const { signup, login, googleLogin, verifyGoogleToken } = require('../controllers/authcontroller');

const router = express.Router();

// Local authentication routes
router.post('/signup', signup);
router.post('/login', login);

// Google authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleLogin
);

// Google token verification route (for frontend direct verification)
router.post('/google/verify', verifyGoogleToken);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed', error: err.message });
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
