
const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
