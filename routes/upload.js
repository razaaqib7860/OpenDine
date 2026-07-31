const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { createOwnerRestaurant } = require("../controllers/owner");

// router.post(
//     "/",
//     upload.array("images"),
//     createOwnerRestaurant
// );
router.post(
  "/",
  (req, res, next) => {
    console.log("1️⃣ Before Multer");
    next();
  },
  upload.array("images"),
  (err, req, res, next) => {
    if (err) {
      console.error("❌ Multer Error:", err);
      return res.status(500).json({ message: err.message });
    }
    next();
  },
  (req, res, next) => {
    console.log("2️⃣ After Multer");
    console.log(req.body);
    console.log(req.files);
    next();
  },
  createOwnerRestaurant
);

module.exports = router;