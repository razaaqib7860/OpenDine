const User=require("../models/user");
const {setUser,requireLogin}=require("../service/auth");
const jwt=require("jsonwebtoken")

const { renderError } = require("./error");


async function signup(req, res) {
  try {
    const { Name, email, password, phone,role } = req.body;

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

    const redirectTo = req.body.redirect || "/";
    return res.redirect(redirectTo);

  } catch (error) {
      console.error(error);
      renderError(req, res);
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

    const redirectTo = req.body.redirect || "/";
    return res.redirect(redirectTo);  

  } catch (error) {
        console.error(error);
        renderError(req, res);
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
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.redirect("/user/login");
        }

        return res.render("profile", {
            user
        });

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

async function updateProfile(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.redirect("/user/login");
        }

        const { name, email, phone } = req.body;

        if (name) user.Name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();

        return res.redirect("/profile");

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

module.exports={signup,login,logout,profile,updateProfile};

