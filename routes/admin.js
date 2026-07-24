const express = require("express");
const router = express.Router(); 

const { getAllRestaurant,
        approveRestaurant,
        getAdminStats} = require("../controllers/admin")

router.get("/", (req,res)=>{
    return res.render("");
});
router.get("/restaurants",getAllRestaurant);
router.put("/restaurants/approve/:id",approveRestaurant);
router.get("/stats",getAdminStats);


module.exports = router;