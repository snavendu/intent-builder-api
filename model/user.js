const mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
        min:6
    },
    profilePicture:{
        type:String,
        defaultValue:""
    },
    followers:{
        type:Array,
        defaultValue:[],
    },
    following:{
        type:Array,
        defaultValue:[],
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
   
}, {
    timestamps:true
})


module.exports = mongoose.model("User",userSchema);