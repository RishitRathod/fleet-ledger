const express = require('express');
const router = express.Router();
const refuelingController = require('../controllers/refuelingcontroller');

// Create a new refueling record
router.post('/add', refuelingController.addFuelEntry);

// Get all refueling records
router.get('/', refuelingController.getAllRefuelingEntries);

// Get refueling records by date range
router.get('/getRefuelingByDateRange', refuelingController.getRefuelingByDateRange);

// Delete a refueling record by ID
router.delete('/:id', refuelingController.deleteRefuelingEntry);

// Update a refueling record by ID
router.put('/:id', refuelingController.updateRefuelingEntry);

module.exports = router;
