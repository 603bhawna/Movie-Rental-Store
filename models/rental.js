const mongoose=require('mongoose');
const {Customer}=require('./customer.js');
const {Movie}=require('./movie');
const joi=require('joi');

const rentalSchema=new mongoose.Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,ref:Customer},
    movieId:{type:mongoose.Schema.Types.ObjectId,ref:Movie},
    dateOut:{type:String},
    dateReturn:{type:String},
    isRented:{type:Boolean},
    rentedCopies:{type:Number}
});
const Rental=mongoose.model('Rental',rentalSchema);

module.exports.Rental=Rental;