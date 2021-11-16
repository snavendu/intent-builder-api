const express = require("express");

const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const userRouter = require("./router/user");
const auithRouter = require("./router/auth");
const nlpRouter = require("./router/nlp");
const bodyParser = require('body-parser');
const cors = require('cors');


dotenv.config();

mongoose.connect(process.env.MONGO_HOST,{useNewURlParser:true},()=>{
    console.log("connected to the mongo")
});


//middleware
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/nlp",nlpRouter);
app.use("/api/users",userRouter);
app.use("/api/auth",auithRouter);



app.get("/",(req,res)=>{
    res.json("welcone to the app");
})

app.listen(8080,()=>{
    console.log("app is running")
})