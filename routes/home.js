const express = require("express");
const router = express.Router();   


router.get("/", (req,res)=>{
//     console.log("FROM ROUTE:", res.locals.user);
    return res.render("home");
});


module.exports = router;