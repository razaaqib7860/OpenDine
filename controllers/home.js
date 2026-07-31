const Restaurant = require("../models/restaurant");

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

        res.render("home", {
            user: req.user,
            featuredRestaurants,
            exclusiveRestaurants
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    renderHome,
}