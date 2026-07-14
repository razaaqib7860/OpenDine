const express = require("express");
const router = express.Router();   


router.get("/", (req,res)=>{
    return res.render("owner");
});
router.post("/",(req,res)=>{
    return res.redirect("/owner/dashboard");
})
router.get("/owner/dashboard",(req,res)=>{
    return res.render("dashboard");
});


module.exports = router;