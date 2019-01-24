const requireSignin = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect('/signin');
};

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send(401);
};

module.exports = {
  requireAuth,
  requireSignin,
};
