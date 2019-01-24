const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// ======================== Setup Passport ========================
passport.use(new LocalStrategy({
  successRedirect: '/',
  failureRedirect: '/signin',
  usernameField: 'email',
  passwordField: 'password',
}, function(email, password, done) {
  const user = User.find(email);
  if (!user) {
    return done(null, false, {message: 'Incorrect email'});
  }
  user.comparePassword(password, (err, result) => {
    if (err) console.log('Error comparing passwords', {err});
    if (result) return done(null, user);
    else return done(null, false, {message: 'Incorrect password.'});
  });
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
