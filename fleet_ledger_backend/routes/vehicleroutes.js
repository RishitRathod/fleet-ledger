const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclecontroller');
const getUsersWithTotalAmount = require('../controllers/userwiseexpensecontroller')
router.post('/createVehicle', vehicleController.createVehicle);
router.get('/getUsersWithTotalAmount', getUsersWithTotalAmount.getUsersWithTotalAmount)
router.post('/getVehicleunderadmin', vehicleController.getVehicleunderadmin);
router.post('/getVehicledata', vehicleController.getVehicledata);
router.get('/getVehicles', vehicleController.getVehicles);
// router.put('/:id', vehicleController.updateVehicle);
// router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
