const mongoose = require('mongoose');
const User = require('./User');

const jobSchema = mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please Provide Company Name'],
        maxlength:50
    },position:{
        type:String,
        required:[true,'Please Provide Position Name'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['interview','decline','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Should to sign in ']
    }
},{timestamps:true});

const Job = new mongoose.model('Job',jobSchema);

module.exports = Job;