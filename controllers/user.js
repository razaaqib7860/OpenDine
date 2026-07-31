const User=require("../models/user");
const {setUser,requireLogin}=require("../service/auth");
const jwt=require("jsonwebtoken")

async function signup(req, res) {
  try {
    const { Name, email, password, phone } = req.body;

    if (!Name || !email || !password || !phone) {
      return res.render("signup", {
        error: "All fields are required",
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.render("signup", {
        error: "User already exists",
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

     if (user.role === "admin") {
    return res.redirect("/admin/dashboard");
    }

    if (user.role === "owner") {
    return res.redirect("/owner/dashboard");
    }

    const redirectTo = req.body.redirect || "/restaurants";
    return res.redirect(redirectTo);

  } catch (err) {
    console.error(err);
    return res.render("signup", {
      error: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        error: "User not found",
      });
    }

    if (user.password !== password) {
      return res.render("login", {
        error: "Invalid password",
      });
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    if (user.role === "admin") {
    return res.redirect("/admin/dashboard");
    }

    if (user.role === "owner") {
    return res.redirect("/owner/dashboard");
    }

    const redirectTo = req.body.redirect || "/restaurants";
    return res.redirect(redirectTo);  
  } 
    
    catch (err) {
    console.error(err);

    return res.render("login", {
      error: "Internal server error",
    });
  }
}

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

