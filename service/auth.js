
const jwt=require("jsonwebtoken");
const secret = process.env.SECRET;

//store user 
function setUser(user){
    return jwt.sign({
        _id: user._id,
        Name:user.Name,
        email: user.email,
    },secret);
}
//get user
function getUser(token){
    if(!token) return null;
    return jwt.verify(token,secret); //it return true/false
}

module.exports={
    setUser,
    getUser,
}