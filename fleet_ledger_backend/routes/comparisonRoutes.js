const express = require('express');
const router = express.Router();
const {getusercomparison} = require('../controllers/comparisonController'); // Adjust the path as necessary

router.post('/getusercomparison', getusercomparison);
// router.post('/getvehiclecomparison', comparisonController.getvehiclecomparison);
// router.post('/getuservehiclecomarison', comparisonController.getuservehiclecomarison);
// router.post('/getvehicleusercomparison', comparisonController.getvehicleusercomparison);

module.exports = router;
