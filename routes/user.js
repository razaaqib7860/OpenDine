const express = require("express");
const router = express.Router();
const newUserController = require("../controllers/userr");

//signup
router.get("/signup",(req,res)=>{
    return res.render("signup");
});
router.post("/signup",newUserController.signup);

//login
router.get("/login", (req,res)=>{
    return res.render("login")
});
router.post("/login",newUserController.login);

module.exports = router;
