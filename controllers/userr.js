const User=required("../models/user");

//signup
//POST /user/signup
async function signup(req,res){
const {name,email,password} = req.body;
if(!name||!email||!password){
    return res.render("login",{error:"All feild are required!"})
}
const existUser=await User.findOne({email,password});
if(existUser){
    return res.render("register",{error:"User already exist",message:"please login"});
}
await User.create({
    name,
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
if(existUser.email!==existUser.password){
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


