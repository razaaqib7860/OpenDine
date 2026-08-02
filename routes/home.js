const express = require("express");
const router = express.Router();   
const homeController=require("../controllers/home");
const { updateProfile} = require("../controllers/user");
const { checkAuth } = require("../middleware/auth");

router.get("/",homeController.renderHome);

router.get("/discover", (req, res) => {
    res.render("discover");
});

router.get("/profile", checkAuth, homeController.profile);

router.post("/profile/update", checkAuth, updateProfile);

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/cuisines", (req, res) => {
    res.redirect("/#cuisines");
});

router.get("/privacy", (req, res) => {
    res.render("privacy");
});

router.get("/terms", (req, res) => {
    res.render("terms");
});

module.exports = router;