const {Rental}=require('../models/rental');
const {Movie}=require('../models/movie');
const express=require('express');
const { Customer } = require('../models/customer');
const asyncHandler = require('express-async-handler');
const mongoose=require('mongoose');
const router=express.Router();

let dateTime=new Date().toLocaleString();

router.get('/rentHistory/:movieId',asyncHandler(async(req,res)=>{
    const rent=await Rental.find({movieId:req.params.movieId,isRented:false});
    if(!rent)
    return res.status(404).send('The movie with given id doesnt exist');
    res.send(rent);
}));

router.get('/currentRentDetails',asyncHandler(async(req,res)=>{
    const rents=await Rental.find({isRented:true});
    if(!rents)
        return res.status(404).send('No movie is rented out yet');
    res.send(rents);
}));

router.get('/rentOutMovie/:customerId/:movieId/:copies',asyncHandler(async(req,res)=>{
    const customer=await Customer.findById(req.params.customerId );
    if(!customer)
        return res.status(404).send('The customer with given id doesnt exist');
    const movie=await Movie.findById(req.params.movieId);
    if(!movie)
        return res.status(404).send('The movie with given id doesnt exist');
    if(movie.stock>=req.params.copies)
        movie.stock=movie.stock-req.params.copies;
    else
        return res.status(404).send('The stock of this movie is not sufficient to rent out');
    await movie.save();
    const rent = await Rental.findOne({customerId:req.params.customerId ,movieId:req.params.movieId})
    if(rent){
        rent.rentedCopies=rent.rentedCopies+parseInt(req.params.copies);
        await rent.save();
        return res.send(rent);
    }
    let newRent = new Rental({
        customerId:customer._id,
        movieId:movie._id,
        dateOut:dateTime,
        isRented:true,
        rentedCopies:parseInt(req.params.copies)
    })
    newRent=await newRent.save();
    res.send(newRent);
}));

router.get('/returnMovie/:rentId/:copies',asyncHandler(async(req,res)=>{
    const rent=await Rental.findOne({_id:req.params.rentId,isRented:true})
    if(!rent)
        return res.status(404).send('The rented item with given id doesnt exist');
    rent.dateReturn=dateTime;
    rent.isRented=false;
    await rent.save();
    const movie=await Movie.findById(rent.movieId);
    if(!movie)
        return res.status(404).send('The movie with given id doesnt exist');
    movie.stock=movie.stock+(parseInt( req.params.copies));

    await movie.save();
    res.send(rent);
}));

module.exports=router;