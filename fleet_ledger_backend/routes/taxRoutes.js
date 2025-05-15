const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxcontroller');

// Create a new tax record
router.post('/createTax', taxController.createTax);

// Get all tax records
router.get('/getAllTaxes', taxController.getAllTaxes);

// Get tax records by date range
router.get('/getTaxesByDateRange', taxController.getTaxesByDateRange);

// Get a specific tax record
router.get('/getById/:id', taxController.getTaxById);

// Update a tax record
router.put('/updateTax/:id', taxController.updateTax);

// Delete a tax record
router.delete('/deleteTax/:id', taxController.deleteTax);

module.exports = router;
