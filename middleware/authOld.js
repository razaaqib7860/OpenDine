const {getUser} = require("../service/auth");

async function checkAuth(req,res,next){
    const token=req.cookies.uid;

    if(!token){
        return res.redirect("/user/login");
    }
    const user=getUser(token);
    if(!user){
        return res.redirect("/user/login");
    }
    req.User=user;
    next();
}
    module.exports=checkAuth;