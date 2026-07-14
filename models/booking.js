const mongoose=require("mongoose");

const BookingSchema=new mongoose.Schema({

 user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    resturant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturant",
        required:true,
    },

    date:{
        type:Date,
        required:true,
    },

    time:{
        type:String,
        required:true
    },

    guests:{
        type:Number,
        required:true,
        min:1,
    },

    occasion:{
        type:String,
        trim:true,
    },

    specialRequests:{
        type:String,
        trim:true,
    },

    status:{
        type:String,
        enum:["confirmed","cancelled","completed"],
        default:"confirmed",
    },

},{timestamps:true});

const Booking=mongoose.model("Resturant",BookingSchema);
module.exports=Booking;