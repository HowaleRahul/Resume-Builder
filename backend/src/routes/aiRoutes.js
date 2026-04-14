const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/ats-score', aiController.calculateAtsScore);
router.post('/improve', aiController.enhanceResumeText);
router.post('/compare', aiController.compareResumes);
router.post('/compare-text', aiController.compareResumes);
router.post('/translate', aiController.translateResume);
router.post('/check-syntax', aiController.checkSyntax);
router.post('/jd-match', aiController.matchJobDescription);
router.post('/tailor', aiController.tailorResume);
router.post('/cover-letter', aiController.generateCoverLetter);
router.post('/skill-gap', aiController.getSkillGap);
router.post('/interview-prep', aiController.getInterviewPrep);
router.post('/analyze-portfolio', aiController.analyzePortfolio);
router.post('/parse-pdf', upload.single('file'), aiController.parsePdf);

module.exports = router;
