const Job = require('../models/Job');
const logger = require('../utils/logger');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body });
    const savedJob = await job.save();
    res.json({ success: true, job: savedJob });
    logger.info('New Job tracked', { jobId: savedJob._id, user: savedJob.userId });
  } catch (err) {
    logger.error('Error creating Job', { error: err.message });
    res.status(400).json({ success: false, message: 'Failed to create job' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.jobId, { status: req.body.status }, { new: true });
    res.json({ success: true, job });
    logger.info('Job status updated', { jobId: job._id, newStatus: job.status });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Update failed' });
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
