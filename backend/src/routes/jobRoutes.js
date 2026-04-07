const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/create', jobController.createJob);
router.get('/list/:userId', jobController.getJobs);
router.put('/update/:jobId', jobController.updateJobStatus);
router.delete('/delete/:jobId', jobController.deleteJob);
router.get('/stats/:userId', jobController.getJobStats);

module.exports = router;
