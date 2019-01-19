module.exports = (req, res, next) => {
  console.log(`User is authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) next();
  else res.redirect('/signin');
};
