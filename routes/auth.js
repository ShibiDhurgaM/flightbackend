const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require('bcrypt');
//REGISTER

router.post("/signup",async(req,res)=>{
    const{username,email,password,confirmPassword}=req.body;

    if(password!==confirmPassword)
    {
        return res.status(400).json({error:"Passwords do not match"});
    }
    try{
       
        const hashedPass= await bcrypt.hash(password,10);
        const newUser=new User(
            {
                username,
                email,
                password:hashedPass,
            }
        );
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err)
    {
        res.status(500).json({error:err.message});
    }
});
//LOGIN

router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
            const user = await User.findOne({ email });
        if(!user)
        {
            return res.status(400).json({error:"Wrong credentials!"});
        }
        const validate=await bcrypt.compare(password, user.password)
       if(!validate)
       {
        return res.status(400).json({error:"Wrong credentials!"});
       }
        
        const{password:userPassword,...userData}=user._doc;
        res.status(200).json(userData);
    } catch(err)
    {
        res.status(500).json({ error: err.message });
    }
})
module.exports=router;