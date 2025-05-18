const { check, validationResult } = require("express-validator");

const validateSignup = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  check("gender").isIn(["male", "female"]).withMessage("Gender must be male or female"),
  check("username").notEmpty().withMessage("Username is required"),
check("isAdmin").isIn(["true", "false"]).withMessage("Role must be selected"),


  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const isApi =
        req.headers['content-type']?.includes('application/json') ||
        req.accepts('json') === 'json';

      if (isApi) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      return res.status(400).render("signup", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    next();
  },
];

module.exports = validateSignup;
