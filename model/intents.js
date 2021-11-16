const mongoose = require("mongoose");

const intentSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,

    },
    url:{
        type:String,
    },
    project:{
        type:String
    }
})


module.exports = mongoose.model("Intents",intentSchema);
