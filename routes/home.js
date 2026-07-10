const express = require("express");
const router = express.Router();    
const Url=require("../models/url"); 

router.get("/", (req, res) => {
     return res.render("home");
});

router.get("/track/:shortUrl", async (req,res)=>{
    const url = await Url.findOne({
        shortUrl:req.params.shortUrl
    });
    res.render("track",{
        url
    });

});

module.exports = router;