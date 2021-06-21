const {User,validate}=require('../models/user');
const express=require('express');
const _ =require('lodash');
const bcrypt=require('bcrypt');
const asyncHandler = require('express-async-handler');

const router=express.Router();

router.get('/',asyncHandler(async(req,res)=>{
    const users=await User.find().sort('name');
    res.send(users);
}));

router.get('/:userId',asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.userId);
    if(!user)
        return res.status(404).send("The user with given id doesn't exist");
    res.send(user);
}));

router.post('/',asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send("User already exist");
    }
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin:req.body.isAdmin
      });
    //user=new User(_.pick(req.body,['name','email','password','isAdmin']));
    const salt=await bcrypt.genSalt(10);
    user.password =await bcrypt.hash(user.password,salt);
    await user.save();
    const token=user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','isAdmin']));
}));


module.exports=router;