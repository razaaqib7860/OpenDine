const express = require("express");
const router = express.Router();   

const RestaurantController = require("../controllers/restaurant");

router.get("/",RestaurantController.getRestaurants);
router.get("/featured",RestaurantController.renderFeaturedRestaurants);
router.get("/:slug",RestaurantController.getRestaurantBySlug);
router.get("/:id",RestaurantController.getRestaurantById)
router.get("/:id/availability",RestaurantController.getRestaurantAvailability);



module.exports = router;