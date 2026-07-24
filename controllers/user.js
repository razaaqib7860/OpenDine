const User=require("../models/user");
const {setUser}=require("../service/auth");
const jwt=require("jsonwebtoken")

//signup
//POST /user/signup
// async function signup(req,res){
// const {Name,email,password,phone} = req.body;
// if(!Name||!email||!password||!phone){
//     return res.redirect("/user/signup",
//         {error:"All feild are required!"})
// }
// const existUser=await User.findOne({email});
// if(existUser){
//     return res.redirect("/user/login",
//         {error:"User already exist",message:"please login"});
// }
// const user= await User.create({
//     Name,
//     phone,
//     email,
//     password,
// });
// const token = setUser(user);
// res.cookie("uid", token);
// return res.redirect("/");
// }
async function signup(req, res) {
  console.log("BODY:", req.body);
  try {
    const { Name, email, password, phone } = req.body;

    if (!Name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      Name,
      email,
      password,
      phone,
    });

    const token = setUser(user);
    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


//login
//POST /user/login
// async function login(req,res){
// try {
// const {email,password} = req.body;
// if(!email||!password){
//     return res.redirect("/user/login",{error:"Email and password are required!"})
// }

// const existUser=await User.findOne({email,password});

// if(!existUser){
//     return res.redirect("/user/login",{error:"User not found!"})
// }

// if(existUser.password!==password){
//      return res.redirect("/user/login",{error:"Password incorrect!"})
// }

// const token = setUser(existUser);
// res.cookie("uid",token,{
//     httpOnly:true
// });
// return res.redirect("/");
//     } catch (error) {
//         console.error(error);
//     }
// }
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

//update
//PUT /user/update/:id


//logout
async function logout(req,res){
    res.clearCookie("uid");
    return res.redirect("/");
}


// Get user profile
// GET /user/profile
// Access: Private
async function profile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports={signup,login,logout,profile};

