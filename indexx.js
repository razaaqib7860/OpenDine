
require("dotenv").config(); //it will help 

const express=require("express");
const app=express();

const cookieParser=require("cookie-parser");
const {checkAuth,restrictTo}=require("./middleware/auth");

const connectMongoDB=require("./connection");
connectMongoDB(process.env.MONGO_URL);


//routes require
const home=require("./routes/home")
const user=require("./routes/user")
const owner=require("./routes/owner")
//test
app.get("/test", (req, res) => {
  return res.send("<h1>SSR (Server Side Rendering)</h1>" )
  });

//middleware
app.use(cookieParser());
app.use(checkAuth);
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//Set EJS as the view engine
app.set("view engine", "ejs");  
app.set("views", "./views"); 

//public
app.use(express.static("public"));

//routes
app.use("/",home);
app.use("/user",user);
app.use("/owner",restrictTo('customer'),owner);

//port
const PORT = process.env.PORT || 2340;
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})