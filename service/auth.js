
const jwt=require("jsonwebtoken");
const secret = process.env.SECRET;

//store user 
function setUser(user){
    return jwt.sign({
        _id: user._id,
        Name: user.Name,
        email: user.email,
        role: user.role,
    },secret);
}
//get user
function getUser(token){
    if(!token) return null;
    return jwt.verify(token,secret); //it return true/false
}

function requireLogin(req, res, next) {

    if (!req.user) {

        req.session.returnTo = req.originalUrl;

        return res.redirect("/user/login");
    }

    next();
}

module.exports={
    setUser,
    getUser,
    requireLogin,
}