const mongoose=require('mongoose');
const joi=require('joi');

const customerSchema=new mongoose.Schema({
    name:{type:String,required:true,minlength:3,maxlength:20},
    address:{type:String,required:true,minlength:5,maxlength:50},
    mobile:{type:String,required:true,minlength:10,maxlength:10}
});

const Customer=mongoose.model('Customer',customerSchema);

const validateCustomer=(customer)=>{
    const schema={
        name:joi.string().min(5).max(50).required(),
        address:joi.string().min(5).max(50).required(),
        mobile:joi.string().length(10).required()
    };
    return joi.validate(customer,schema);
}

module.exports.validate=validateCustomer;
module.exports.Customer=Customer;