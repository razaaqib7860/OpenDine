const express = require("express");
const router = express.Router();   

const { getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus}=require("../controllers/owner");

router.get("/dashboard",getOwnerRestaurant);

router.post("/",createOwnerRestaurant); //middle ware for image upload

router.put("/",updateOwnerRestaurant);  //middle ware for image upload

router.get("/bookings",getOwnerBookings);

router.put("/bookings/status/:id",updateBookingStatus);


module.exports = router;