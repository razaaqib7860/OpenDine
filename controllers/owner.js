const Restaurant = require("../models/restaurant");
const Booking = require("../models/booking");
const { renderError } = require("./error");


async function ownerDashboard(req, res) {
    const restaurant = await Restaurant.findOne({
        owner: req.user._id
    });

      // New owner (no restaurant yet)
        if (!restaurant) {
            return res.render("owner-dashboard", {
                user: req.user,
                restaurant: null,
                ownerBookings: []
            });
        }

    const ownerBookings = restaurant? await Booking.find({
        restaurant: restaurant._id
    })
    .populate("user", "Name email phone")
    .sort({ createdAt: -1 })
    : [];

    res.render("owner-dashboard", {
        user: req.user,
        restaurant,
        ownerBookings,
    });
}

// GET /owner/register-restaurant
async function renderRestaurantForm(req, res) {
    try {

        if (!req.user) {
            return res.redirect("/user/login");
        }

        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        // Already registered
        if (restaurant) {
            return res.redirect("/owner/dashboard");
        }

        return res.render("owner-newRestaurant", {
            user: req.user,
            title: "Register Restaurant"
        });


    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
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
        renderError(req, res);
    }
}

async function createOwnerRestaurant(req, res) {
    try {

        if (!req.user) {
            return res.redirect("/user/login");
        }

        const existing = await Restaurant.findOne({
            owner: req.user._id
        });

        if (existing) {
            return res.render("owner-newRestaurant", {
                user: req.user,
                restaurant: null,
                error: "You already have a restaurant registered."
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
            totalTables,
            openingTime,
            closingTime
        } = req.body;

        if (!name || !description || !cuisine || !priceRange || !address) {
            return res.render("owner-newRestaurant", {
                user: req.user,
                restaurant: null,
                error: "Please fill all required fields."
            });
        }

        // Generate slug
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const slugExists = await Restaurant.findOne({ slug });

        if (slugExists) {
            return res.render("owner-newRestaurant", {
                user: req.user,
                restaurant: null,
                error: "A restaurant with this name already exists."
            });
        }

        // Images
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }

        // Parse Arrays
        const parsedCuisine =
            typeof cuisine === "string"
                ? cuisine.split(",").map(c => c.trim())
                : cuisine;

        const parsedTags =
            typeof tags === "string"
                ? tags.split(",").map(t => t.trim())
                : [];

        const parsedSlots =
            typeof availableSlots === "string"
                ? availableSlots.split(",").map(s => s.trim())
                : [
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00"
                ];

        await Restaurant.create({
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
            totalSeats: totalSeats ? Number(totalSeats) : 20,
            totalTables: totalTables ? Number(totalTables) : 0,
            openingTime,
            closingTime,
            status: "pending"
        });

        // Redirect to dashboard after successful registration
        return res.redirect("/owner/dashboard");

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

// async function updateOwnerRestaurant(req,res){
//     try {

//         const restaurant = await Restaurant.findOne({
//             owner:req.user._id
//         });

//         if(!restaurant){
//             return res.status(404).json({
//                 message:"Restaurant profile not found"
//             });
//         }


//         const {
//             name,
//             description,
//             cuisine,
//             priceRange,
//             location,
//             address,
//             chef,
//             tags,
//             availableSlots,
//             totalSeats,
//             openingTime,
//             closingTime
//         } = req.body;


//         if(name) restaurant.name = name;
//         if(description) restaurant.description = description;
//         if(priceRange) restaurant.priceRange = priceRange;
//         if(location) restaurant.location = location;
//         if(address) restaurant.address = address;
//         if(chef) restaurant.chef = chef;


//         if(cuisine){
//             restaurant.cuisine =
//                 typeof cuisine === "string"
//                 ? cuisine.split(",").map(c=>c.trim())
//                 : cuisine;
//         }


//         if(tags){
//             restaurant.tags =
//                 typeof tags === "string"
//                 ? tags.split(",").map(t=>t.trim())
//                 : tags;
//         }


//         if(availableSlots){
//             restaurant.availableSlots =
//                 typeof availableSlots === "string"
//                 ? availableSlots.split(",").map(s=>s.trim())
//                 : availableSlots;
//         }


//         if(totalSeats !== undefined)
//             restaurant.totalSeats = totalSeats;


//         if(openingTime)
//             restaurant.openingTime = openingTime;

//         if(closingTime)
//             restaurant.closingTime = closingTime;


//         if(req.files && req.files.length > 0){
//             restaurant.images = req.files.map(file=>file.path);
//         }

//          if (name) {
//             restaurant.slug = name
//                 .toLowerCase()
//                 .replace(/[^a-z0-9]+/g, "-")
//                 .replace(/(^-|-$)+/g, "");
//         }


//         await restaurant.save();

//         return res.redirect("/owner/dashboard");

//     } catch (error) {
//         console.error(error);
//         renderError(req, res);
//     }
// }

//Get bookings for  owner's restaurant 
//GET /owner/bookings

async function updateOwnerRestaurant(req, res) {
    try {

        const restaurant = await Restaurant.findOne({
            owner: req.user._id
        });

        if (!restaurant) {
            return res.redirect("/owner/dashboard");
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
            totalTables,
            openingTime,
            closingTime
        } = req.body;

        // Basic Details
        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (priceRange) restaurant.priceRange = priceRange;
        if (location) restaurant.location = location;
        if (address) restaurant.address = address;
        if (chef) restaurant.chef = chef;

        // Arrays
        if (cuisine) {
            restaurant.cuisine =
                typeof cuisine === "string"
                    ? cuisine.split(",").map(c => c.trim())
                    : cuisine;
        }

        if (tags) {
            restaurant.tags =
                typeof tags === "string"
                    ? tags.split(",").map(t => t.trim())
                    : tags;
        }

        if (availableSlots) {
            restaurant.availableSlots =
                typeof availableSlots === "string"
                    ? availableSlots.split(",").map(s => s.trim())
                    : availableSlots;
        }

        // Numbers
        if (totalSeats)
            restaurant.totalSeats = Number(totalSeats);

        if (totalTables)
            restaurant.totalTables = Number(totalTables);

        // Timing
        if (openingTime)
            restaurant.openingTime = openingTime;

        if (closingTime)
            restaurant.closingTime = closingTime;

        // Images
        if (req.files && req.files.length > 0) {
            restaurant.images = req.files.map(file => file.path);
        }

        // If restaurant name changes, regenerate slug
        if (name) {
            restaurant.slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
        }

        // Since details changed, send for review again (optional)
        // restaurant.status = "pending";

        await restaurant.save();

        return res.redirect("/owner/dashboard");

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

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
        
    }catch (error) {
        console.error(error);
        renderError(req, res);
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
        renderError(req, res);
    }
}


module.exports={
    ownerDashboard,
    renderRestaurantForm,
    getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus,
}