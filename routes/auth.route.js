const express = require('express');
const {
  register,
  login,
  logout,
  renderLogin,
  renderSignup
} = require('../controllers/auth.controller');

const validateSignup = require('../middlewares/validators/signupValidator');
const checkPasswordStrength = require('../middlewares/security/checkPasswordStrength');
const isAdmin = require('../middlewares/auth/isAdmin');
const isUser = require('../middlewares/auth/isUser');
const validateLogin = require('../middlewares/validators/validateLogin');
const router = express.Router();


router.post('/login', validateLogin, login);


router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.post('/register', validateSignup, checkPasswordStrength, register);
router.post('/login',validateLogin, login);
router.get('/logout', logout);



router.get('/admin', isAdmin, (req, res) => {
  res.render('admin');
});

router.get('/user', isUser, (req, res) => {
  res.render('user');
});

module.exports = router;
