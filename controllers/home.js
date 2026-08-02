const Restaurant = require("../models/restaurant");
const User = require("../models/user");
const { renderError } = require("./error");

async function renderHome(req, res) {
    try {
        const featuredRestaurants = await Restaurant.find({
            status: "approved",
            featured: true
        }).limit(8);

        const exclusiveRestaurants = await Restaurant.find({
            status: "approved",
            exclusive: true
        }).limit(8);
        
        // console.log(req.user);

        res.render("home", {
            user: req.user,
            featuredRestaurants,
            exclusiveRestaurants
        });

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

async function profile(req, res) {
    try {
        if (!req.user) {
            return res.redirect("/user/login");
        }

        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.redirect("/user/login");
        }

        return res.render("profile", {
            user,
            title: "My Profile"
        });

    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
}

module.exports = {
    renderHome,
    profile,
}