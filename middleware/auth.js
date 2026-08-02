const {getUser} = require("../service/auth");


// async function checkAuth(req,res,next){
//     const token = req.cookies.uid;
//     if(!token){
//         res.locals.user = null;
//         return next();
//     }
    
//     const user = getUser(token);
//     if(!user){
//         res.locals.user = null;
//         return next();
//     }

//     req.user = user;
//     res.locals.user = user;
//     next();
// }

async function checkAuth(req,res,next){

    let token = req.cookies.uid;

    // check Authorization header
    if(!token && req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        req.user = null;
        return next();
    }

    // console.log("TOKEN:", token);

    const user = getUser(token);

    // console.log("DECODED USER:", user);

    // console.log("USER:", user);

    if(user){
        req.user = user;
        res.locals.user = user;
    }

    next();
}

function restrictTo(roles=[]){
    return function(req,res,next){
       if (!req.user) {
    return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
        if(!roles.includes(req.user.role)){
            return res.end("UnAuthorized");
        }
        next();
    }
}


module.exports={checkAuth,restrictTo};