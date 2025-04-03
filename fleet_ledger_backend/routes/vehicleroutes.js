const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclecontroller');
const getVehiclesWithTotalAmount = require('../controllers/vehiclewisecontroller')
router.post('/createVehicle', vehicleController.createVehicle);
router.post('/getVehicleunderadmin', vehicleController.getVehicleunderadmin);
router.post('/getVehicledata', vehicleController.getVehicledata);
router.get('/getVehicles', vehicleController.getVehicles);
router.get('/getVehiclesWithTotalAmount', getVehiclesWithTotalAmount.getVehiclesWithTotalAmount);
// router.put('/:id', vehicleController.updateVehicle);
// router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
