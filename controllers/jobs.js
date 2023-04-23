const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).send({jobs, noHits:jobs.length});
};

const getJob = async(req,res)=>{
    // const job = await Job.findById(req.params.id);
    const {params:{id:jobId},user:{userId}} = req
    const job = await Job.findOne({createdBy:userId , _id:jobId})
    if(!job){
        throw new NotFoundError('this job not exist');
    };
    
    res.status(StatusCodes.OK).send(job);
};

const createJob = async(req,res)=>{
    /// get user from auth middleware
    req.body.createdBy = req.user.userId;

    const job =await  Job.create(req.body);

    res.status(StatusCodes.CREATED).json({job})
};

const updateJob = async(req,res)=>{

    const {params:{id:jobId},
        user:{userId},
        body:{company , position}} = req;

    if(company === '' || position === ''){
        throw new BadRequestError('Company or position can not be Empty')
    };

    const job = await Job.findOneAndUpdate({createdBy:userId,_id:jobId},
            req.body,
            {new:true , runValidators:true});
    
    if(!job){
        throw new NotFoundError('this job not exist')
    };

    res.status(StatusCodes.OK).send(job);
};

const deleteJob = async(req,res)=>{
    const {params:{id:jobId} , user:{userId}} =  req;
    
    const job = await Job.findOneAndDelete({_id:jobId , createdBy:userId});
    
    res.status(StatusCodes.OK).send({deletedJob:job});
};

module.exports = {
    deleteJob,
    createJob,
    getAllJobs,
    getJob,
    updateJob
}