const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/servicecontroller');

// Create a new service record
router.post('/createService', serviceController.createService);

// Get all service records
router.get('/getAllServices', serviceController.getAllServices);

// Get service records by date range
router.get('/getServicesByDateRange', serviceController.getServicesByDateRange);

// Get a specific service record
router.get('/getById/:id', serviceController.getServiceById);

// Update a service record
router.put('/updateService/:id', serviceController.updateService);

// Delete a service record
router.delete('/deleteService/:id', serviceController.deleteService);

module.exports = router;
