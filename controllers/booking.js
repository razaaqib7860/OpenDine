

//Create a new booking
//POST /bookings
//@access private
async function createBooking(req,res){
    try {
        const {restaurantId,date,time,guests,occasion,specialRequests}=req.body;
        if()
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
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
}