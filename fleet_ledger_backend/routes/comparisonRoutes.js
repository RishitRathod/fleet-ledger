const express = require('express');
const router = express.Router();
const {getusercomparison, getvehiclecomparison, getuservehiclecomparison, getvehicleusercomparison} = require('../controllers/comparisonController'); // Adjust the path as necessary

router.post('/getusercomparison', getusercomparison);
router.post('/getvehiclecomparison', getvehiclecomparison);
router.post('/getuservehiclecomparison', getuservehiclecomparison);
router.post('/getvehicleusercomparison', getvehicleusercomparison);

module.exports = router;
