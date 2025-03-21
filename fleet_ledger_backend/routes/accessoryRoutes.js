const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/accessorycontroller');

// Routes for Service
router.post('/createAccessory', serviceController.createAccessory);
router.get('/getAllServices', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
