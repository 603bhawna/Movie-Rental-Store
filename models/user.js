const mongoose=require('mongoose');
const joi = require('joi');
const config=require('config');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,minlength:5,maxlength:50},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:5,maxlength:355,},
    isAdmin:{type:Boolean,default:false}
});

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}

const User=mongoose.model('User',userSchema);

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}


const validateUser=(user)=>{
    const schema={
        name:joi.string().min(5).max(50).required(),
        email:joi.string().email().required(),
        password:joi.string().min(5).max(355).required(),
        isAdmin:joi.boolean().default(false)
    };
    return joi.validate(user,schema);
}

module.exports.User=User;
module.exports.validate=validateUser;