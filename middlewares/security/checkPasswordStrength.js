const zxcvbn = require("zxcvbn");

function checkPasswordStrength(req, res, next) {
  const { password } = req.body;
  const strength = zxcvbn(password);
  if (strength.score < 2) {
    return res.status(400).json({
      message: "Password is too weak. Try a stronger one."
    });
  }
  next();
}
module.exports = checkPasswordStrength;
