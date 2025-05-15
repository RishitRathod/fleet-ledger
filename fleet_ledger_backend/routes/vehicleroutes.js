const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclecontroller');
const getVehiclesWithTotalAmount = require('../controllers/vehiclewisecontroller')
const vehiclewiseController = require('../controllers/vehiclewisecontroller'); // added this line
const getExpenseCategory = require('../controllers/expensecategorycontroller'); // added this line
router.post('/createVehicle', vehicleController.createVehicle);
router.post('/getVehicleunderadmin', vehicleController.getVehicleunderadmin);
router.post('/getVehicledata', vehicleController.getVehicledata);
router.get('/getVehicles', vehicleController.getVehicles);
router.get('/vehiclewiseamount', vehiclewiseController.getVehiclesWithTotalAmount);
router.get('/vehiclewiseamount/date-range', vehiclewiseController.getVehiclesWithTotalAmountByDateRange);
router.get('/getVehiclesWithTotalAmount', getVehiclesWithTotalAmount.getVehiclesWithTotalAmount);
router.get('/getExpenseCategory', getExpenseCategory.getExpenseCategory);
router.post('/getExpenseCategoryByUserEmail', getExpenseCategory.getExpenseCategoryByUserEmail);
// router.put('/:id', vehicleController.updateVehicle);
// router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
