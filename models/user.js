const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    Name:{type:String,required:true},
    phone:{type:String,required:true,minlength:10},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true,minlength:6},
    role:{type:String,enum:["customer","owner","admin"],default:"customer"},
},{timestamps:true});

const User=mongoose.model("User",userSchema);//it will create a collection named "users" in the database

module.exports=User;