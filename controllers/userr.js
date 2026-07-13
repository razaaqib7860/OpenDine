const User=require("../models/user");
const {setUser}=require("../service/auth");
const jwt=require("jsonwebtoken")

//signup
//POST /user/signup
async function signup(req,res){
const {Name,email,password,phone} = req.body;
if(!Name||!email||!password||!phone){
    return res.render("signup",
        {error:"All feild are required!"})
}
const existUser=await User.findOne({email});
if(existUser){
    return res.render("login",
        {error:"User already exist",message:"please login"});
}
const user= await User.create({
    Name,
    phone,
    email,
    password,
});
const token = setUser(user);
res.cookie("uid", token);
return res.redirect("/");
}


//login
//POST /user/login
async function login(req,res){
try {
const {email,password} = req.body;
if(!email||!password){
    return res.render("login",{error:"Email and password are required!"})
}

const existUser=await User.findOne({email,password});

if(!existUser){
    return res.render("login",{error:"User not found!"})
}

if(existUser.password!==password){
     return res.render("login",{error:"Password incorrect!"})
}

const token = setUser(existUser);
res.cookie("uid",token,{
    httpOnly:true
});
return res.redirect("/");
    } catch (error) {
        console.error(error);
    }
}

//logout
async function logout(req,res){
    res.clearCookie("uid");
    return res.redirect("/login");
}

//get user profile
//GET /user/profile
//@access private => autheticate middleware
async function profile(req,res){

}

module.exports={signup,login,logout,profile};

