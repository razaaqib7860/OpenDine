
require("dotenv").config(); 

const express=require("express");
const app=express();

const cookieParser=require("cookie-parser");
const {checkAuth,restrictTo}=require("./middleware/auth");

const connectMongoDB=require("./connection");
console.log("MONGO_URL:", process.env.MONGO_URL);
connectMongoDB(process.env.MONGO_URL);

const methodOverride = require("method-override");

//middleware
// const cors = require("cors");
// app.use(
//   cors({
//     origin: "https://fictional-cod-v697w5gjx6jqfxx69-8080.app.github.dev", //frontend URL
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes require
const home=require("./routes/home");
const user=require("./routes/user");
const restaurant=require("./routes/restaurant");
const booking=require("./routes/booking");
const owner=require("./routes/owner");
const admin=require("./routes/admin");
const imgUpload = require("./routes/upload");
const { renderError } = require("./controllers/error");

//test
// app.get("/test", (req, res) => {
//   return res.send("<h1>SSR (Server Side Rendering)</h1>" )
//   });

//middleware
app.use(cookieParser());
app.use(checkAuth);
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//Set EJS as the view engine
app.set("view engine", "ejs");  
app.set("views", "./views"); 

//public
app.use(express.static("public"));

//routes
// app.use("/",home);
app.use("/",home);
app.use("/user",user); 
app.use("/restaurants",restaurant);
app.use("/bookings",booking); 
// app.use("/owner",restrictTo(['owner','admin']),owner);
app.use("/owner",owner);
app.use("/upload", imgUpload );
// app.use("/admin",restrictTo(["admin"]),admin);
app.use("/admin",admin);



//port
const PORT = process.env.PORT || 2340;
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})
