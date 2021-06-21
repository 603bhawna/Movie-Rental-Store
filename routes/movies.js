const {validate,Movie}=require('../models/movie');
const auth=require('../middlewares/auth');
const admin=require('../middlewares/admin');
const asyncHandler = require('express-async-handler');
const express=require('express');

const router=express.Router();

router.get('/',asyncHandler(async(req,res)=>{
    const movies=await Movie.find().sort('rentalRate');
    res.send(movies);
}));

router.get('/:movieId',asyncHandler(async(req,res)=>{
    const movie=await Movie.findById(req.params.movieId);
    if(!movie)
    return res.status(404).send("The movie with given id doesn't exist");
    res.send(movie);
}));

router.post('/',auth,asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    let movie=new Movie({
        title:req.body.title,
        rentalRate:req.body.rentalRate,
        stock:req.body.stock
    });
    movie=await movie.save();
    res.send(movie);
}));

router.put('/:movieId',auth,asyncHandler(async(req,res)=>{
    const validation=validate(req.body);
    if(validation.error){
        return res.status(400).send(validation.error.details[0].message);
    }
    const movie=await Movie.findByIdAndUpdate(req.params.movieId,
        {title:req.body.title,rentalRate:req.body.rentalRate,stock:req.body.stock},{new:true});
    if(!movie){
        return res.status(404).send('The movie with given id doesnt exist');
    }
    res.send(movie);
}));

router.delete('/:movieId',[auth,admin],asyncHandler(async(req,res)=>{
    const movie=await Movie.findByIdAndRemove(req.params.movieId);
    if(!movie){
        return res.status(404).send('The movie with given id doesnt exist');
    }
    res.send(movie);
}));

module.exports=router;