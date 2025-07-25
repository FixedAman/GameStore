const express = require("express");
const authcontrollers = require("../controllers/auth-controller");
const router = express.Router();
const validatorMiddleware = require("../middlewares/validate-middleware");
const zodvalidator = require("../validators/auth-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const requirePayment = require("../middlewares/checkPayment-middleware");
// data we get from the controller
router.route("/").get(authcontrollers.home);

router
  .route("/register")
  .post(
    validatorMiddleware.validate(zodvalidator.signupSchema),
    authcontrollers.register
  );
router
  .route("/login")
  .post(
    validatorMiddleware.loginValid(zodvalidator.signinSchema),
    authcontrollers.login
  );
router
  .route("/store-protected")
  .get(authMiddleware, requirePayment, (req, res) => {
    res.json({ message: "welcome to the paid stores" });
  });
router.route("/user").get(authMiddleware, authcontrollers.user);
module.exports = router;
