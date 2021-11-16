const router = require("express").Router();
const User = require("./../model/user");
const bcrypt = require("bcrypt");

router.post("/register", async(req,res)=>{
    const {username,email, password} = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const user = await new User({
            username,
            email,
            password:hashedPass
        });
        await user.save();
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({msg:"something went wrong"})
    }

});


router.post("/login",async(req,res)=>{
    const {username,email,password}=req.body;

    // check for username or email

    try {
        
        const user = await User.findOne({
            email
        });
        !!!user&&res.status(404).json({msg:"user not found"});
    
        //check for password
    
        const validPass = await bcrypt.compare(password,user.password);
    
        !!!validPass&&res.status(400).json({msg:"password is incorrect"});
    
        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({msg:"something went wrong"})
        
    }


})

module.exports=router;