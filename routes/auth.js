const express = require("express");
const {
  userSignUpRules,
  userLoginRules,
  validate,
} = require("../middlewares/validations");
const {
  postLogin,
  getLogin,
  getLogout,
  getSignUp,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const router = express.Router();

router.route("/login").get(getLogin).post(userLoginRules, validate, postLogin);
router.route("/logout").get(getLogout);
router
  .route("/signup")
  .get(getSignUp)
  .post(userSignUpRules, validate, postSignUp);
router.route("/reset-password").get(getResetPassword).post(postResetPassword);
router.route("/reset-password/:token").get(getNewPassword);
router.route("/new-password").post(postNewPassword);

module.exports = router;
