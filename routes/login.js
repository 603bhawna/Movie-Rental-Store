const {User}=require('../models/user');
const joi=require('joi');
const bcrypt=require('bcrypt');
const express=require('express');
const asyncHandler = require('express-async-handler');
const router=express.Router();

const validate=(user)=>{
    const schema={
        email:joi.string().email().required(),
        password:joi.string().min(5).max(255).required()
    };
    return joi.validate(user,schema);
}

router.post('/',asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    let user=await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send("Invalid emailId");
    }
    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
        return res.status(400).send("Invalid password");
    }
    const token=user.generateAuthToken();
    if(!token){
        res.status(400).send("False :unsuccessful to login");
    }
    res.header('x-auth-token',token).send("True:successful to login");
}));

module.exports=router;



