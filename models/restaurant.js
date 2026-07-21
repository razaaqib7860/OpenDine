const mongoose=require("mongoose");

const ResturantSchema=new mongoose.Schema({

 owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    slug:{
         type:String,
         required:true,
         unique:true,
         trim:true,
         lowercase:true
    },

    description:{
        type:String,
        required:true,
    },

    cuisine:{
        type:[String],
        required:true,
        trim:true
    },

    tags:{
        type:[String],
    },

    priceRange:{
        type:String,
        enum:["₹","₹₹","₹₹₹","₹₹₹₹"],
        required:true
    },

    images: {
    type: [String],
    default: ["/images/default-restaurant.jpg"]
    },

    chef:{
        type:String,
    },

    address:{
        type:String,
        required:true
    },

    pincode:String,

    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },
        coordinates:{
            type:[Number], // [longitude, latitude]
            required:true
        }
    },

    openingTime:{
        type:String,
        required:true
    },

    closingTime:{
        type:String,
        required:true
    },
    
    availableSlots: {
    type: [String],
    default: []
    },

    slotDuration:{
        type:Number,
        default:60
    },

    totalSeats:{
        type:Number,
        default:20
    },

    totalTables:{
        type:Number,
        required:true
    },

    capacity:{
        type:Number,
        default:4
    },

    averageRating:{
        type:Number,
        default:5.0,
        min:1,
        max:5,
    },

    totalReviews:{
        type:Number,
        default:0
    },

    isOpen:{
        type:Boolean,
        default:true
    },

    featured:{
        type: Boolean,
        default:false
    },

    exclusive:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        enum:["approved","pending","rejected"],
        default:"pending"
    }

},{timestamps:true});

const Resturant=mongoose.model("Resturant",ResturantSchema);
module.exports=Resturant;