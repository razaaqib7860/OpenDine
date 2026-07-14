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
         trim:true
    },

    description:{
        type:String,
        required:true,
    },

    cuisine:{
        type:[String],
        required:true
    },

    priceRange:{
        type:String,
        enum:["₹","₹₹","₹₹₹","₹₹₹₹"]
    },

    images:[
        {
            type:String
        }
    ],

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
        default:0
    },

    totalReviews:{
        type:Number,
        default:0
    },

    isOpen:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

const Resturant=mongoose.model("Resturant",ResturantSchema);
module.exports=Resturant;