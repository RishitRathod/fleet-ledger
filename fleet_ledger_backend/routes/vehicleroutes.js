const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclecontroller');

router.post('/createVehicle', vehicleController.createVehicle);
// router.get('/', vehicleController.getVehicles);
// router.get('/:id', vehicleController.getVehicleById);
// router.put('/:id', vehicleController.updateVehicle);
// router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
