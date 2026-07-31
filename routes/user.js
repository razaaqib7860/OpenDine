const express = require("express");
const router = express.Router();
const newUserController = require("../controllers/user");

//signup
// router.get("/signup",(req,res)=>{
//     return res.render("signup");
// });
router.post("/signup",newUserController.signup);
router.get("/signup",(req,res)=>{
    return res.render("signup");
})
//login
// router.get("/login", (req,res)=>{
//     return res.render("login")
// });
router.post("/login",newUserController.login);
router.get("/login", (req, res) => {
    res.render("login", {
        redirect: req.query.redirect || "/"
    });
});
//logout
router.get("/logout",newUserController.logout);

//profile
// router.get("/user")
module.exports = router;
