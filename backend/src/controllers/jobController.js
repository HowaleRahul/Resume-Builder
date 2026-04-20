const Job = require('../models/Job');
const logger = require('../utils/logger');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body });
    const savedJob = await job.save();
    res.json({ success: true, job: savedJob });
    logger.info('New Job tracked', { jobId: savedJob._id, user: savedJob.userId });
  } catch (err) {
    logger.error('Error creating Job', { 
      error: err.message, 
      stack: err.stack,
      body: req.body 
    });
    res.status(400).json({ 
      success: false, 
      message: err.message || 'Failed to create job' 
    });
  }
};

exports.getJobs = async (req, res) => {
  const { userId } = req.params;
  try {
    logger.info(`Fetching jobs for user: ${userId}`);
    const jobs = await Job.find({ userId }).sort({ updatedAt: -1 });
    logger.info(`Found ${jobs.length} jobs for user: ${userId}`);
    res.json({ success: true, jobs });
  } catch (err) {
    logger.error('Error fetching jobs', { 
      error: err.message, 
      userId,
      stack: err.stack 
    });
    res.status(500).json({ success: false, message: 'Server error', details: err.message });
  }
};


exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.jobId, { ...req.body }, { new: true });
    res.json({ success: true, job });
    logger.info('Job updated', { jobId: job._id, updatedFields: Object.keys(req.body) });
  } catch (err) {
    logger.error('Job update failed', { error: err.message, jobId: req.params.jobId });
    res.status(400).json({ success: false, message: 'Update failed', details: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ success: true });
    logger.info('Job deleted', { jobId: req.params.jobId });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Delete failed' });
  }
};

exports.getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
