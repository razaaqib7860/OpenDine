

//Create a new booking
//POST /bookings

const Restaurant = require("../models/restaurant");
const Booking = require("../models/booking");

//@access private
async function createBooking(req,res){
    try {
        const {restaurantId,date,time,guests,occasion,specialRequests}=req.body;
        if(!restaurantId||!date||!time||!guests){
            return res.status(400).json({message:"please provide all required reservation details"});
        }

      //  check if Resturant exist
      const restaurant=await Restaurant.findById(restaurantId);
      if(!restaurant){
        return res.status(400).json({message:"Restaurant not Found"});
      }
      //verify restaurant approved
      if(restaurant.status!=="approved"){
        return res.status(400).json({message:"Reservation is not open for the Restaurant yet!"});
      }

      //check seat aviality
      const requestedGuests=Number(guests);


      const existingBooking=await Booking.find({
        restaurant:restaurantId,
        date: new Date(date),
        time,
        status:"confirmed",
      })
      const bookedSeats = existingBooking.reduce((sum,b)=>sum+b.guests,0)
      const totalSeats=Restaurant.totalSeats || 20;
      const availableSeats=totalSeats-bookedSeats;

      if(requestedGuests>availableSeats){
        res.status(400).json({
            message:`Unable to reserve. Only ${availableSeats} seats are available for this time slot.`,
        })

        const booking = await Booking.create({
            user: req.user?._id,
            restaurant:restaurantId,
             date: new Date(date),
             time,
             guests:Number(guests),
             occasion,
             specialRequests,
             status:"confirmed",
        })

        //populate resturant info before returning
        const populatedBooking= await booking.populate("restaurant","name location image address");
        res.status(201).json(populatedBooking);

      }



    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

//Get logged in user bookings
//GET /mybookings
//@access private
async function getMyBookings(req,res){
    try {
        const bookings=(await Booking.find({user:req.user?._id})
        .populate("restaurant","name,location image address slug")).sort({date:-1,time:-1});
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

//Cancel booking
//PUT /bookings/:id/cancel
//@access private
async function cancelBooking(req,res){
    try {
        const booking=await Booking.findById(req.params.id);
        if(!booking){
            res.status(404).json({message:"Booking not found"});
            return;
        }
        //Verfy user owns the bookings
        if(booking.user.toString()!==req.user?._id.toString()){
            res.status(401),json({message:"Not authorized to cancel this booking" });
            return;
        }
        booking.status="cancelled";
        await booking.save();
        
        const populatedBooking=await booking.populate("restaurant","name location image address");
        res.json(populatedBooking);

    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
}


module.exports={
    createBooking,
    getMyBookings,
    cancelBooking,
}