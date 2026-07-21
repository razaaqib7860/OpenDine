const express = require("express");
const router = express.Router();   

const ResturantController = require("../controllers/resturant");

router.get("/",ResturantController.getResturants);
router.get("/featured",ResturantController.getFeatureResturants);
router.get("/:slug",ResturantController.getResturantBySlug);
router.get("/:id/availability",ResturantController.getResturantAvailability);



module.exports = router;