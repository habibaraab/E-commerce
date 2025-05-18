function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }


  if (req.accepts('html')) {
    return res.redirect('/auth/login');
  }


  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = isAuthenticated;
