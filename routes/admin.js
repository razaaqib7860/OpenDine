const express = require("express");
const router = express.Router(); 

const { renderAdminDashboard,
        getAllRestaurant,
        approveRestaurant,
        getAdminStats} = require("../controllers/admin")

// router.get("/", (req,res)=>{
//     return res.render("home");
// });
router.get("/dashboard",renderAdminDashboard);
router.get("/restaurants",getAllRestaurant);
router.put("/restaurants/approve/:id",approveRestaurant);
router.get("/stats",getAdminStats);


module.exports = router;