
const Restaurant = require("../models/restaurant");
const Booking=require("../models/booking");

const getRestaurants=async(req,res)=>{
    try {
        const {search,cuisine,priceRange,rating,location,sort}= req.query;

        //build query object
        const queryObj = {
            status:"approved"
        };
        
        if(search){
            queryObj.$or=[    
                {name:{$regex:search,$options:"i"}},
                {cuisine:{$regex:search,$options:"i"}},
                {tags:{$regex:search,$options:"i"}},
            ]
        }
        if(cuisine){
         queryObj.cuisine={
        $in:[new RegExp(cuisine,"i")]
     }}
        if(priceRange){
            const prices=ARRAY.isArray(priceRange)? priceRange:[priceRange];
            queryObj.priceRange={$in:prices};
        }
        if(rating){
            queryObj.rating={$gte:parseFloat(rating)};
        }
        if(location){
            queryObj.location={$regex:location,$options:"i"}
        }

        //Sorting
        let sortOption={createdAt:-1}         //means by default the restaurant which 
                                             //is created at recently(-1=descending order) 
        if(sort==="rating"){
            sortOption={rating:-1}          //(-1 means descending order)
        }else if(sort==="price_low"){
            sortOption={priceRange:1};       //(1 means ascending order)
        }else if(sort==="price_high"){
            sortOption={priceRange:-1}
        }

        const restaurantResult=await Restaurant.find(queryObj).sort(sortOption);
        res.render("restaurants", {
    restaurants: restaurantResult,
    filters: req.query,
    user: req.user
});

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
};

const getFeatureRestaurants=async(req,res)=>{
    try {
        const featuredRestaurants = await Restaurant.find({
        status: "approved",
        featured: true}).limit(6);

        res.render("home", {
        user: req.user,
        featuredRestaurants
});
    } catch (error) {
        console.error("Get featured Restaurants Error:",error);
        res.status(500).json({message:"server error"});
    }
};

async function renderFeaturedRestaurants(req,res){

    const restaurants = await Restaurant.find({
        status:"approved",
        featured:true
    });

    res.render("restaurants",{
        restaurants,
        user:req.user,
        title:"Featured Restaurants"
    });

}

const getRestaurantBySlug=async(req,res)=>{
    try {
        const restaurant = await Restaurant.findOne({
            status:"approved",
            slug:req.params.slug
        })
        if(!restaurant){
            res.status(404).json({message:"Restaurant not found"});
            return;
        }
    //    return res.json(restaurant);
       res.render("restaurant_details",{
        restaurant,
        user:req.user
    });

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
};

async function getRestaurantById(req, res) {
    try {
      console.log("PARAMS:", req.params);
        console.log("REQ ID:", req.params.id);
        console.log(
            "VALID OBJECT ID:",
            mongoose.Types.ObjectId.isValid(req.params.id)
        );

        const restaurant = await Restaurant.findById(req.params.id)
            .populate("owner", "Name email phone");

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        return res.json({
            success: true,
            restaurant
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// const getRestaurantAvailability=async(req,res)=>{
//     try {
//         const {date}=req.query;
//         if(!date){
//             res.status(400).json({message:"please provide a date"});
//             return;
//         }
//     const restaurant=await Restaurant.findById(req.params.id);
//     if(!restaurant){
//         res.status(404).json({message:"Restaurant not found"})
//         return;
//     }
//     const bookingDate=new Date().toLocaleString;

// //Get all active bookings on this date for the restaurant;
//     const bookings=await Booking.find({
//         restaurant:restaurant._id,
//         // date:Date,
//         date: new Date(date),
//         status:"confirmed",
//     });

//     //map slots to available capacities
//     const availablity=restaurant.availableSlots.map((slot)=>{
//         const bookedSeats = bookings.filter((b)=>b.time===slot).reduce((sum,b)=>sum+b.guests,0)

//         const totalSeats=restaurant.totalSeats || 20;
//         const availableSeats=Math.max(0,totalSeats-bookedSeats);

//         return {
//             time:slot,
//             availableSeats,
//             isAvailable: availableSeats>0
//         }
//     })
//     res.json(availablity)

//     } catch (error) {
//         console.error(error);
//         res.status(400).json({message:error.message});
//     }
// };
const getRestaurantAvailability = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please provide a date",
            });
        }

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found",
            });
        }

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            restaurant: restaurant._id,
            date: {
                $gte: start,
                $lte: end,
            },
            status: "confirmed",
        });

        const totalSeats = restaurant.totalSeats || 20;

        const availability = restaurant.availableSlots.map((slot) => {

            const bookedSeats = bookings
                .filter((b) => b.time === slot)
                .reduce((sum, b) => sum + b.guests, 0);

            const availableSeats = Math.max(0, totalSeats - bookedSeats);

            return {
                time: slot,
                bookedSeats,
                availableSeats,
                isAvailable: availableSeats > 0,
            };
        });

        res.json(availability);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports={
getRestaurants,
getFeatureRestaurants,
getRestaurantBySlug,
getRestaurantById,
getRestaurantAvailability,
renderFeaturedRestaurants,
}