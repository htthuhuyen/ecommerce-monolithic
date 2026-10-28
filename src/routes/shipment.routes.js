
const express = require('express');
const router = express.Router();

const {
    createShipment,
    getAllShipments,
    updateShipment
} = require('../controllers/shipment.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createShipment);
router.get('/', verifyToken, getAllShipments);
router.put('/:id', verifyToken, updateShipment);

module.exports = router;
