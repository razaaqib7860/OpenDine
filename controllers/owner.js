const Restaurant = require("../models/restaurant");
const Booking = require("../models/booking");


async function ownerDashboard(req, res) {
    const restaurant = await Restaurant.findOne({
        owner: req.user._id
    });

    // const bookings = await Booking.find({
    //     restaurant: restaurant?._id
    // }).populate("user");
    const ownerBookings = restaurant
    ? await Booking.find({
        restaurant: restaurant._id
    })
    .populate("user", "Name email phone")
    .sort({ createdAt: -1 })
    : [];

    res.render("owner-dashboard", {
        user: req.user,
        restaurant,
        // bookings,
        ownerBookings,
    });
}


//Get owner's restaurant
//GET /owner/restaurant
async function getOwnerRestaurant(req,res){
    try {
        const restaurant = await Restaurant.findOne({owner: req.user._id});
        if(!restaurant){
            res.status(200).json(null);
            return;
        }

        const ownerBookings = restaurant? await Booking.find({restaurant: restaurant._id})
        .populate("user", "Name email phone")
        : [];

        res.render("owner-dashboard", {
        user: req.user,
        restaurant,
        ownerBookings
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({message:error.message});
    }
}

async function createOwnerRestaurant(req, res) {
    try {

        // console.log("BODY:", req.body);
        // console.log("FILES:", req.files);
        // console.log("USER:", req.user);


        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        const existing = await Restaurant.findOne({
            owner: req.user._id
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You already have a restaurant registered"
            });
        }


        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
            openingTime,
            closingTime,
            totalTables
        } = req.body;



        // Required fields
        if (!name || !description || !cuisine || !priceRange || !address) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }



        // Generate slug
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");



        const slugExists = await Restaurant.findOne({ slug });

        if (slugExists) {
            return res.status(400).json({
                success: false,
                message: "A restaurant with this name already exists"
            });
        }



        // Images
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }



        // Parse arrays coming from FormData
        const parsedCuisine =
            typeof cuisine === "string"
                ? cuisine.split(",").map(c => c.trim())
                : cuisine;



        const parsedTags =
            typeof tags === "string"
                ? tags.split(",").map(t => t.trim())
                : tags || [];



        const parsedSlots =
            typeof availableSlots === "string"
                ? availableSlots.split(",").map(s => s.trim())
                : availableSlots || [
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00"
                ];



        const restaurant = await Restaurant.create({
            owner: req.user._id,
            name,
            slug,
            description,
            cuisine: parsedCuisine,
            priceRange,
            location,
            address,
            chef: chef || "",
            tags: parsedTags,
            images: imageUrls,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats): 20,
            totalTables: totalTables ? Number(totalTables): 0,
            openingTime,
            closingTime,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Restaurant registered successfully",
            restaurant
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//Update owner's restaurant
//PUT /owner/restaurant
// async function updateOwnerRestaurant(req,res){
//     try {
//         const restaurant= await Restaurant.findOne({owner:req.user?._id})
//         if(!restaurant){
//             res.status(404).json({message:"Restaurant profile not found"});
//             return;
//         }
//         const {name,description,cuisine,priceRange,location,address,chef,tags,availableSlots,totalSeats}=req.body;
//         if (name) restaurant.name = name;
//         if (description) restaurant.description = description;
//         if (cuisine) restaurant.cuisine = cuisine;
//         if (priceRange) restaurant.priceRange = priceRange;
//         if (location) restaurant.location = location;
//         if (address) restaurant.address = address;
//         if (chef) restaurant.chef = chef;
//         if (totalSeats) restaurant.totalSeats = totalSeats;

//         if (tags){
//              restaurant.tags = typeof tags ==="string"? tags.split(",").map((t)=>t.trim()):
//         tags;
//         }

//         if (availableSlots){
//             restaurant.availableSlots = typeof availableSlots==="string"? availableSlots.split(",")
//         .map((s)=>s.trim()): availableSlots;
//         } 
       
//         //Handle new image upload if any
//         if (images){
//             if (req.files && req.files.length > 0) {
//              restaurant.images = req.files.map(file => file.path);
//             }
//         }


//         await restaurant.save();
//         return res.status(200).json({
//             message: "Restaurant updated successfully",
//             restaurant
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(400).json({message:error.message});
//     }
// }
async function updateOwnerRestaurant(req,res){
    try {

        const restaurant = await Restaurant.findOne({
            owner:req.user._id
        });

        if(!restaurant){
            return res.status(404).json({
                message:"Restaurant profile not found"
            });
        }


        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
            openingTime,
            closingTime
        } = req.body;


        if(name) restaurant.name = name;
        if(description) restaurant.description = description;
        if(priceRange) restaurant.priceRange = priceRange;
        if(location) restaurant.location = location;
        if(address) restaurant.address = address;
        if(chef) restaurant.chef = chef;


        if(cuisine){
            restaurant.cuisine =
                typeof cuisine === "string"
                ? cuisine.split(",").map(c=>c.trim())
                : cuisine;
        }


        if(tags){
            restaurant.tags =
                typeof tags === "string"
                ? tags.split(",").map(t=>t.trim())
                : tags;
        }


        if(availableSlots){
            restaurant.availableSlots =
                typeof availableSlots === "string"
                ? availableSlots.split(",").map(s=>s.trim())
                : availableSlots;
        }


        if(totalSeats !== undefined)
            restaurant.totalSeats = totalSeats;


        if(openingTime)
            restaurant.openingTime = openingTime;

        if(closingTime)
            restaurant.closingTime = closingTime;


        if(req.files && req.files.length > 0){
            restaurant.images = req.files.map(file=>file.path);
        }


        await restaurant.save();


        res.status(200).json({
            message:"Restaurant updated successfully",
            restaurant
        });


    } catch(error){
        console.error(error);

        res.status(500).json({
            message:error.message
        });
    }
}


//Get bookings for  owner's restaurant 
//GET /owner/bookings
async function getOwnerBookings(req,res){
    try {
        // console.log("USER FROM REQUEST:", req.user);
      const restaurant= await Restaurant.findOne({owner:req.user?._id});
              console.log("RESTAURANT:", restaurant);
        if(!restaurant){
            res.status(404).json({message:"Restaurant profile not found"});
            return;
        }  
        const bookings = await Booking.findOne({restaurant:restaurant._id})
        .populate("user","Name email phone").sort({date:-1,time:-1})

        res.json(bookings);
        
    }
    catch(error){
    return res.status(500).json({
        success: false,
        message: error.message,
    });
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
    ownerDashboard,
    getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus,
}