const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/parse', resumeController.parseResume);
router.post('/generate', resumeController.generateResume);
router.post('/compile', resumeController.compilePdf);
router.post('/save', resumeController.saveResume);
router.get('/list/:userId', resumeController.listResumes);
router.get('/:id', resumeController.getResumeById);

module.exports = router;
