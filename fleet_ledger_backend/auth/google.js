const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log environment variables for debugging (without exposing secrets)
console.log('Google Auth Config:', {
  clientIDExists: !!process.env.GOOGLE_CLIENT_ID,
  clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
  callbackURLExists: !!process.env.GOOGLE_CALLBACK_URL
});

// Only initialize Google strategy if credentials are available
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Google authentication is not configured. Missing client ID or secret.');
} else {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user information from Google profile
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const picture = profile.photos[0].value;
      const googleId = profile.id;

      // Check if user already exists with this Google ID
      let user = await User.findOne({ where: { googleId } });

      if (user) {
        // User exists, update their profile if needed
        user.profilePicture = picture; // Update profile picture in case it changed
        await user.save();
        return done(null, user);
      }

      // Check if user exists with this email
      user = await User.findOne({ where: { email } });

      if (user) {
        // Update existing user with Google information
        user.googleId = googleId;
        user.authProvider = 'google';
        user.profilePicture = picture;
        await user.save();
        return done(null, user);
      }

      // Create a new user
      const newUser = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        authProvider: 'google',
        role: 'user' // Default role for new users
      });

      return done(null, newUser);
    } catch (err) {
      console.error('Google authentication error:', err);
      return done(err, null);
    }
  }
));
}

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
