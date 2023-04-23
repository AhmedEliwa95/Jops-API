const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'Please Provide a Name'],
        maxlength:[30,'then name should not exceed 30 chars'],
        minlength:[3,'Please insert more than two Chars']
    },password:{
        type:String,
        required:[true , 'Password should be required'],
        minlength:[3,'Please insert more than two Chars'],
        maxlength:[60,'then Password should not exceed 30 chars'],
    },email:{
        type:String,
        minlength:[3,'Please Insert more than two Chars'],
        maxlength:[50,'The email shiuld not exceed 50 Chars'],
        unique:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please Provide Valid Email' ,]
    },token:{
        type:String
    }
});
/// virtual releation between jobs and users 
userSchema.virtual('jobs',{
    ref:'Job',
    localField:'_id',
    foreignField:'createdBy'
})

userSchema.methods.createJWT = function(){
    const token = jwt.sign({userId:this._id.toString(),name:this.name},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_LIFETIME});
    
    return token

};

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt)
    next();
    // await user.save()
});

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject._id
    delete userObject.password
    return userObject
};

userSchema.statics.findUserByCredentials =async function(email,password){
    const user =await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Email or Password')
    };
    const validPassword =await bcrypt.compare(password,user.password);
    if(!validPassword){
        throw new UnauthenticatedError('Invalid Email or Password');
    };
    return user;
}

const User = mongoose.model('User' , userSchema);

module.exports = User