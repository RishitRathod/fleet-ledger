const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/accessorycontroller');

// ✅ Specific routes should come first
router.get('/getAllServicesByDateRange', serviceController.getAllServicesByDateRange);
router.post('/createAccessory', serviceController.createAccessory);
router.get('/getAllServices', serviceController.getAllServices);

// ✅ Dynamic routes should come last
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
