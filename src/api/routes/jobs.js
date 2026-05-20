const express = require('express');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.get('/:id', jobController.getJob);

module.exports = router;
