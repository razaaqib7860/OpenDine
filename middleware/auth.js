const {getUser} = require("../service/auth");


async function checkAuth(req,res,next){

    console.log("CHECK AUTH RUNNING");

    const token = req.cookies.uid;

    console.log("TOKEN:",token);


    if(!token){

        res.locals.user = null;

        return next();
    }


    const user = getUser(token);


    console.log("DECODED USER:",user);


    if(!user){

        res.locals.user = null;

        return next();
    }


    req.user = user;

    res.locals.user = user;


    next();
}

function restrictTo(roles=[]){
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