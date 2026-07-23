const express = require("express");
const router = express.Router();   

const RestaurantController = require("../controllers/restaurant");

router.get("/",RestaurantController.getRestaurants);
router.get("/featured",RestaurantController.getFeatureRestaurants);
router.get("/:slug",RestaurantController.getRestaurantBySlug);
router.get("/:id/availability",RestaurantController.getRestaurantAvailability);



module.exports = router;