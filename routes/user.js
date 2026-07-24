const express = require("express");
const router = express.Router();
const newUserController = require("../controllers/user");

//signup
// router.get("/signup",(req,res)=>{
//     return res.render("signup");
// });
router.post("/signup",newUserController.signup);

//login
// router.get("/login", (req,res)=>{
//     return res.render("login")
// });
router.post("/login",newUserController.login);

//logout
router.post("/logout",newUserController.logout);

//profile
// router.get("/user")
module.exports = router;
