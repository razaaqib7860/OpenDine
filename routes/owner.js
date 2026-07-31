const express = require("express");
const router = express.Router();   

const { ownerDashboard,
    getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus} =require("../controllers/owner");

const {checkAuth,restrictTo}=require("../middleware/auth");

router.get("/dashboard",ownerDashboard);

router.get("/",checkAuth,getOwnerRestaurant);

// router.post("/",createOwnerRestaurant); //middle ware for image upload
const upload = require("../middleware/upload");
router.post(
    "/",
    checkAuth,
    upload.array("images"),
    createOwnerRestaurant
);

// router.put("/",updateOwnerRestaurant);  //middle ware for image upload
router.put(
    "/",
    checkAuth,
    upload.array("images"),
    updateOwnerRestaurant
);

router.get("/bookings",checkAuth,getOwnerBookings);

router.put("/bookings/status/:id",checkAuth,updateBookingStatus);


module.exports = router;