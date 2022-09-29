import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors/index.js"
import checkPermissons from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createJob = async (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        throw new BadRequestError('Please Provide all values')
    }
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req, res) => {
    const { search, status, jobType, sort } = req.query
  
    const queryObject = {
      createdBy: req.user.userId,
    }
  
    if (status && status !== 'all') {
      queryObject.status = status
    }
    if (jobType && jobType !== 'all'){
        queryObject.jobType=jobType
    }
    if(search){
        queryObject.position={$regex:search,$options:'i'}
    }
    // NO AWAIT
    let result = Job.find(queryObject)
  
    // chain sort conditions
    if(sort==='latest'){
        result=result.sort('-createdAt')
    }
    if(sort==='oldest'){
        result=result.sort('createdAt')
    }
    if(sort==='a-z'){
        result=result.sort('position')
    } 
    if(sort==='z-a'){
        result=result.sort('-position')
    }
    
    const page =Number(req.query.page)||1;
    const limit=Number(req.query.limit)||1

    const skip=(page-1)*limit
    result=result.skip(skip).limit(limit)


    const jobs = await result

    const totalJobs=await Job.countDocuments(queryObject)
    const numOfPages=Math.ceil(totalJobs/limit)
  
    res
      .status(StatusCodes.OK)
      .json({ jobs, totalJobs, numOfPages })
  }  
const updateJob = async (req, res) => {
    const { id: jobId } = req.params
    const { company, position } = req.body
    if (!position || !company) {
        throw new BadRequestError('Please Provide all values')
    }
    const job = await Job.findOne({ _id: jobId })
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    //check permission 


    checkPermissons(req.user, job.createdBy)

    const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json({ updateJob })


    // job.position=position
    // job.company=company
    // job.jobLocation=jobLocation
    // await job.save()


}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
    const job = await Job.findOne({ _id: jobId })
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    checkPermissons(req.user, job.createdBy)
    await job.remove()
    res.status(StatusCodes.OK).json({ msg: 'success! Job remove ' })
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc;
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])
    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    }).reverse()
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}
export { createJob, deleteJob, updateJob, showStats, getAllJobs }//no export