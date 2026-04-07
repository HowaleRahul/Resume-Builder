const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Sync user from Clerk
router.post('/sync', userController.syncUser);

module.exports = router;
