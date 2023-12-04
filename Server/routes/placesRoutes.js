const express = require("express");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controller/placesController");
const { check } = require("express-validator");
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

//we can add multiple middleware function which will run left to right
router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
); //add array if multiple checks

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

module.exports = router;
