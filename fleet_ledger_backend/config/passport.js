const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only initialize Google strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          return done(null, user);
        }

        // Check if user with same email exists
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Update existing user with Google info
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.profilePicture = profile.photos[0].value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
          authProvider: 'google',
          role: 'user' // Default role
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
  );
}

module.exports = passport;
