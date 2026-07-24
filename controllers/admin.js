const Restaurant = require("../models/restaurant");
const Booking = require("../models/booking");
const User = require("../models/user");

//Get all restaurant for admin management
//GET //amdin/restaurant
async function getAllRestaurant(req,res){
try {
    const restaurant=(await Restaurant.find({}).populate("owner","name email phone")).toSorted({createdAt:-1})
    res.json(restaurant);

} catch (error) {
    console.error(error);
    res.status(400).json({message:error.message});
}
}  

// approved/reject a restaurant status
//PUT //amdin/approve/:id

async function approveRestaurant(req,res){
try {
    const {status}=req.body;
    if(!status||!["approved","rejected","pending"].includes(status)){
        res.status(400).json({message:"Please provide a Valid approval status"});
        return;
    }

    const restaurant= await Restaurant.findById(req.params.id);
    if(!restaurant){
        return res.status(404).json({message:"Restaurant profile not found"})
    }

    restaurant.status= status;
    await restaurant.save();

    res.json(restaurant);
} catch (error) {
    console.error(error);
    res.status(400).json({message:error.message});
}
}


//Get System Statistics
//GET //amdin/stats
async function getAdminStats(req,res){
try {
    const totalUsers= await User.countDocuments({role:"user"});
    const totalOwners= await User.countDocuments({role:"owner"});
    const totalBooking= await Booking.countDocuments({});
    const totalRestaurant=await Restaurant.countDocuments({});

    //Get latest 10 bookings
    const latestBookings= (await Booking.find({}).populate("user","name email")).
    populate("restaurant","name").sort({createdAt:-1}).limit(10);
    res.json({
        user:{
            totalUsers,
            totalOwners,
            total: totalUsers+totalOwners,
        },
        restaurants:{
            total:totalRestaurants,
        },
        bookings:{
            total:totalBooking,
        },
        latestBookings,
    })
} catch (error) {
    console.error(error);
    res.status(400).json({message:error.message});
}
}

module.exports={
    getAllRestaurant,
    approveRestaurant,
    getAdminStats,
}