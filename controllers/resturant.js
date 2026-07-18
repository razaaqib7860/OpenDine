
const Resturant = require("../models/resturant");

const getResturants=async(req,res)=>{
    try {
        const {search,priceRange,rating,location,sort}= req.query;

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
        if(priceRange){
            const prices=ARRAY.is(priceRange)? priceRange:[priceRange];
            queryObj.priceRange={$in:prices};
        }
        if(rating){
            queryObj.rating={$gte:parseFloat(rating)};
        }
        if(location){
            queryObj.location={$regex:location,$options:"i"}
        }

        //Sorting
        let sortOption={createdAt:-1}         //means by default the resturant which 
                                             //is created at recently(-1=descending order) 
        if(sort==="rating"){
            sortOption={rating:-1}          //(-1 means descending order)
        }else if(sort==="price_low"){
            sortOption={priceRange:1};       //(1 means ascending order)
        }else if(sort==="price_high"){
            sortOption={priceRange:-1}
        }

        const resturantResult=await Resturant.find(queryObj).sort(sortOption);
        res.json(resturantResult);

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
};


const getFeatureResturants=async(req,res)=>{
    try {
        const featured=await Resturant.find({
            status:"approved",
            $or:[{featured:true},{exclusive:true}]
        }).limit(6)
        res.json(featured);

    } catch (error) {
        console.error("Get featured Resturants Error:",error);
        res.status(500).json({message:"server error"});
    }
};

const getResturantBySlug=async(req,res)=>{
    try {
        const resturant = await Resturant.findOne({
            status:"approved",
            slug:req.params.slug
        })
        if(!resturant){
            res.status(404).json({message:"Resturant not found"});
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
};

const getResturantAvailability=async(req,res)=>{
    try {
        const {date}=req.query;
        if(!date){
            res.status(400).json({message:"please provide a date"});
            return;
        }
    const resturant=await Resturant.findById(req.params.id);
    if(!resturant){
        res.status(404).json({message:"Resturant not found"})
        return;
    }
    const bookingDate=new Date().toLocaleString;

//Get all active bookings on this date for the restaurant;
    const bookings=await Booking.find({
        restaurant:restaurant._id,
        date:bookingDate,
        status:"confirmed",
    })

    //map slots to available capacities
    const availablity=resturant.availableSlots.map((slot)=>{
        const bookedSeats = bookingDate.filter((b)=>b.time===slot).reduce((sum,b)=>sum+b.guests,0)

        const totalSeats=restaurant.totalSeats || 20;
        const availableSeats=Math.max(0,totalSeats-bookedSeats);

        return {
            time:slot,
            availableSeats,
            isAvailable: availableSeats>0
        }
    })
    res.json(availabilty)


    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
};

module.exports={
getResturants,
getFeatureResturants,
getResturantBySlug,
getResturantAvailability,
}