const {validate,Customer}=require('../models/customer');
const auth=require('../middlewares/auth');
const admin=require('../middlewares/admin');
const asyncHandler = require('express-async-handler');

const express=require('express');

const router=express.Router();

router.get('/',asyncHandler(async(req,res)=>{
    const customers=await Customer.find().sort('name');
    res.send(customers);
}));

router.get('/:customerId',asyncHandler(async(req,res)=>{
    const customer=await Customer.findById(req.params.customerId);
    if(!customer)
    return res.status(404).send("The customer with given id doesn't exist");
    res.send(customer);
}));

router.post('/',auth,asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    let customer=new Customer({
        name:req.body.name,
        address:req.body.address,
        mobile:req.body.mobile
    });
    customer=await customer.save();
    res.send(customer);
}));

router.put('/:customerId',auth,asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    const customer=await Customer.findByIdAndUpdate(req.params.customerId,
        {name:req.body.name,address:req.body.address,mobile:req.body.mobile},{new:true});
    if(!customer){
        return res.status(404).send('The customer with given id doesnt exist');
    }
    res.send(customer);
}));

router.delete('/:customerId',[auth,admin],asyncHandler(async(req,res)=>{
    const customer=await Customer.findByIdAndRemove(req.params.customerId);
    if(!customer){
        return res.status(404).send('The customer with given id doesnt exist');
    }
    res.send(customer);
}));

module.exports=router;