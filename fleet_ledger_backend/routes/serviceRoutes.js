const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/servicecontroller');

// Routes for Service
router.post('/createService', serviceController.createService);
router.get('/getAllServices', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
