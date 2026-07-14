const {getUser} = require("../service/auth");


async function checkAuth(req,res,next){
    const token = req.cookies.uid;
    if(!token){
        res.locals.user = null;
        return next();
    }
    
    const user = getUser(token);
    if(!user){
        res.locals.user = null;
        return next();
    }

    req.user = user;
    res.locals.user = user;
    next();
}

function restrictTo(roles=["admin"]){
    return function(req,res,next){
        if(!req.user){
            return res.redirect("login");
        }
        if(!roles.includes(req.user.role)){
            return res.end("UnAuthorized");
        }
        next();
    }
}


module.exports={checkAuth,restrictTo};