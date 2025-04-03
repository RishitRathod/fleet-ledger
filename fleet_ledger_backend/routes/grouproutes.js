const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupcontroller');

router.post('/assignUserToVehicle', groupController.assignUserToVehicle);
router.post('/getGroupByVehicle', groupController.getGroupByVehicle);
// router.get('/', groupController.getAllAssignments);
// router.delete('/:id', groupController.removeUserFromVehicle);

module.exports = router;
