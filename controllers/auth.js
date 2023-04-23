const User = require('../models/User');
const {StatusCodes} = require('http-status-codes'); 
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

const register = async (req,res)=>{

    const user = new User({...req.body});
    const token = user.createJWT();        
    await user.save();
    
    res.status(StatusCodes.CREATED).send({user,token});


};

const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new BadRequestError('invalid Email or Password')
    }
    const user =await User.findUserByCredentials(email,password)
    const token = user.createJWT();
    res.status(StatusCodes.OK).send({user , token});
    
    // res.send('Login User ')
};





module.exports = {
    login,
    register
}