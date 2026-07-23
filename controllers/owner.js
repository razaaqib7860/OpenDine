const Restaurant = require("../models/restaurant");
const Booking = require("../models/booking");


//Get owner's restaurant
//GET /owner/restaurant
async function getOwnerRestaurant(req,res){
    try {
        const restaurant=await Restaurant.findOne({owner:req.user?._id});
        if(!restaurant){
            res.status(200).json(null);
            return;
        }
        res.json(restaurant);

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}


//Create owner's restaurant (submitted to pending)
//POST /owner/restaurant
async function createOwnerRestaurant(req,res){
    try {
        const existing=await Restaurant.findOne({owner:req.user?._id})
        if(existing){
           return res.status(400).json({message:"you already have a restaurant registered"});
        }

        const {name,description,cuisine,priceRange,location,address,chef,tags,availableSlots,totalSeats}=req.body;
        if(!name||!description||!cuisine ||!priceRange ||!location ||!address ||!chef ||!tags ||!availableSlots ||!totalSeats){
           return res.status(400).json({message:"please provide all required fields"})
        }

        //Generate slug from name
        const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,"");
        const slugExists = await Restaurant.findOne({slug});
        if(slugExists){
            return res.status(400).json({message:"A restaurant with this name already exists"})
        }

        //Handle image
        let imageUrl="";
        if(req.file){
            //handel image upload
        }

        //setup parsed tags and slots
        const parsedTags = typeof tags ==="string"? tags.split(",").map((t)=>t.trim()):
        tags||[];

        const parsedSlots = typeof availableSlots==="string"? availableSlots.split(",")
        .map((s)=>s.trim()): availableSlots || ["17:00","18:00","19:00","20:00","21:00"];

        //create the restaurant
        const restaurant= await Restaurant.create({
            name,
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            image:imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats:totalSeats ? Number(totalSeats): 20,
            owner:req.user?._id,
            status:"pending"
        })
        res.status(201).json(restaurant);

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}


//Update owner's restaurant
//PUT /owner/restaurant
async function updateOwnerRestaurant(req,res){
    try {
        const restaurant= await Restaurant.findOne({owner:req.user?._id})
        if(!restaurant){
            res.status(404).json({message:"Restaurant profile not found"});
            return;
        }
        const {name,description,cuisine,priceRange,location,address,chef,tags,availableSlots,totalSeats}=req.body;
        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (cuisine) restaurant.cuisine = cuisine;
        if (priceRange) restaurant.priceRange = priceRange;
        if (location) restaurant.location = location;
        if (address) restaurant.address = address;
        if (chef) restaurant.chef = chef;
        if (totalSeats) restaurant.totalSeats = totalSeats;

        if (tags){
             restaurant.tags = typeof tags ==="string"? tags.split(",").map((t)=>t.trim()):
        tags;
        }

        if (availableSlots){
            restaurant.availableSlots = typeof availableSlots==="string"? availableSlots.split(",")
        .map((s)=>s.trim()): availableSlots;
        } 
       
        //Handle new image upload if any
        if (images){
             restaurant.images = images;
        }


        await restaurant.save();
        return res.status(200).json({
            message: "Restaurant updated successfully",
            restaurant
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}


//Get bookings for  owner's restaurant 
//GET /owner/bookings
async function getOwnerBookings(req,res){
    try {
     const restaurant= await Restaurant.findOne({owner:req.user?._id})
        if(!restaurant){
            res.status(404).json({message:"Restaurant profile not found"});
            return;
        }  
        const bookings = await Booking.findOne({restaurant:restaurant._id})
        .populate("user","name email phone").sort({date:-1,time:-1})

        res.json(bookings);
        
    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}

//Update status of a booking
//PUT /owner/bookings/status/:id
async function updateBookingStatus(req,res){
    try {
       const {status}=req.body;
       if(!status||!["confirmed","cancelled","completed"].includes(status)){
        res.status(400).json({message:"Please enter a Valid booking status"});
        return;
       }

       const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }

        //Verify booking belongs to the owner's restaurant
        const restaurant= await Restaurant.findById(booking.restaurant)
        if(!restaurant|| restaurant.owner.toString()!== req.user._id.toString()){
           return res.status(401).json({message:"Not authorized to manage this booking"})
        }

        booking.status = status;
        await booking.save();
        res.json(booking);



    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}


module.exports={
    getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus,
}