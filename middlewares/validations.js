const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const userSignUpRules = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body(
    "password",
    "Password must be in range of 5 to 18 characters and must contain at least one digit"
  )
    .trim()
    .isLength({ min: 5, max: 18 })
    .matches(/\d/),
  body("repeatedPassword", "Passwords do not match")
    .trim()
    .isLength({ min: 5, max: 18 })
    .matches(/\d/)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

const userLoginRules = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (!user) {
          return Promise.reject("No such Email registered");
        }
      });
    }),
  body("password", "Password must be in range of 5 to 18 characters")
    .trim()
    .isLength({ min: 5, max: 18 }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).render("auth/signUp", {
    pageTitle: "E-Shop",
    path: req.originalUrl,
    csrfToken: req.session.csrfToken,
    errors: errors.array()[0].msg,
    invalidInput: {
      email: req.body.email,
      password: req.body.password,
      repeatedPassword: req.body.repeatedPassword,
    },
  });
};

module.exports = {
  userSignUpRules,
  validate,
};
