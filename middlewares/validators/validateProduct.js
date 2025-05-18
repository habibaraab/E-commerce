const { check, validationResult } = require("express-validator");

const validateProduct = [
 check("title")
  .isString().withMessage("Title must be a string")
  .notEmpty().withMessage("Title is required"),
  check("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  check("image").notEmpty().withMessage("Image URL is required"),
  check("discount")
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100"),
  check("category")
    .optional()
    .isString().withMessage("Category must be a string"),
  check("description")
    .optional()
    .isString().withMessage("Description must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const isApi = req.headers['content-type']?.includes('application/json');

if (isApi) {
  return res.status(400).json({
    message: "Validation failed",
    errors: errors.array(),
  });
}

return res.status(400).render("product-form", {
  product: {
    ...req.body,
    _id: req.params.id,
  },
  errors: errors.array(),
  isEdit: !!req.params.id,
});

    }

    next();
  }
];

module.exports = validateProduct;
