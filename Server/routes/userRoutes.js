const express = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  postSignUp,
  postLogIn,
} = require("../controller/userController");
const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 })
  ],
  postSignUp
);

router.post("/login", postLogIn);

module.exports = router;
