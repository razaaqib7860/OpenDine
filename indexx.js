const express=require("express");
const app=express();

const connectMongoDB=require("./connection");
connectMongoDB(process.env.MONGO_URL);


//routes require
const home=require(".routes/home")


//test
app.get("/test", (req, res) => {
  return res.send("<h1>SSR (Server Side Rendering)</h1>" )
  });

//middleware
const cookieParser=require("cookie-parser");
app.use(cookieParser());
app.use(express.json())
app.user(express.urlencoded({extended:true}));

//routes
app.use("/",home);
app.use("/user",user);

const PORT = process.env.PORT || 2340;
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})