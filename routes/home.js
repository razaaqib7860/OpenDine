const express = require("express");
const router = express.Router();   
const homeController=require("../controllers/home");

// router.get("/", (req,res)=>{
//     return res.render("home", {
//     user: req.user
// });
// });
router.get("/",homeController.renderHome);

module.exports = router;