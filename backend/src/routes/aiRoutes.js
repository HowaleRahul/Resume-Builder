const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/ats-score', aiController.calculateAtsScore);
router.post('/improve', aiController.enhanceResumeText);
router.post('/compare', aiController.compareResumes);
router.post('/compare-text', aiController.compareResumesByText);
router.post('/translate', aiController.translateResume);
router.post('/check-syntax', aiController.checkSyntax);
router.post('/jd-match', aiController.matchJobDescription);
router.post('/tailor', aiController.tailorResume);
router.post('/cover-letter', aiController.generateCoverLetter);
router.post('/skill-gap', aiController.getSkillGap);
router.post('/interview-prep', aiController.getInterviewPrep);
router.post('/analyze-portfolio', aiController.analyzePortfolio);

module.exports = router;
