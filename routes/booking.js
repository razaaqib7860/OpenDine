const express = require("express");
const router = express.Router();   

const {createBooking,getMyBookings,cancelBooking}=require("../controllers/booking");

router.post("/", createBooking);
router.get("/myBookings",getMyBookings);
router.put("/cancel/:id",cancelBooking);


module.exports = router;