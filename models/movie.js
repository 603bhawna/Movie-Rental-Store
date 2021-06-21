const mongoose=require('mongoose');
const joi=require('joi');

const movieSchema=new mongoose.Schema({
    title:{type:String,required:true,minlength:3,maxlength:50},
    rentalRate:{type:Number,required:true},
    stock:{type:Number,required:true}
});

const Movie=mongoose.model('Movie',movieSchema);

const validateMovie=(movie)=>{
    const schema={
        title:joi.string().min(3).max(50).required(),
        rentalRate:joi.number().required(),
        stock:joi.number().required()
    };
    return joi.validate(movie,schema);
}

module.exports.validate=validateMovie;
module.exports.Movie=Movie;