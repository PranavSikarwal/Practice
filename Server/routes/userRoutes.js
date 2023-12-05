const express = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  postSignUp,
  postLogIn,
} = require("../controller/userController");
const HttpError = require("../models/http-error");
const fileUpload = require("../middleware/file-upload").single('image');
const router = express.Router();

router.get("/", getUsers);
//using multer middleware .single provides middleware of our requirement
router.post(
  "/signup",
  fileUpload,
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 })
  ],
  postSignUp
);

router.post("/login", postLogIn);

module.exports = router;
