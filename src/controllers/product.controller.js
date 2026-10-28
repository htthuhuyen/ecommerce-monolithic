
const prisma = require('../config/prisma');

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { pid: 'asc' }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Loi khi lay danh sach san pham'
        });
    }
};


const createProduct = async (req, res) => {
    try {
        const { pname, price, quantity } = req.body;

        if (
            typeof pname !== 'string' ||
            !pname.trim() ||
            pname.length > 100 ||
            typeof price !== 'number' ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            return res.status(400).json({
                message: 'Du lieu san pham khong hop le'
            });
        }

        const product = await prisma.product.create({
            data: {
                pname: pname.trim(),
                price: price,
                quantity: quantity
            }
        });

        return res.status(201).json({
            message: 'Them san pham thanh cong',
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi them san pham'
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: 'ID khong hop le'
            });
        }

        const product = await prisma.product.findUnique({
            where: { pid }
        });

        if (!product) {
            return res.status(404).json({
                message: 'Khong tim thay san pham'
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi lay san pham'
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const pid = Number(req.params.id);
        const { pname, price, quantity } = req.body;

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: 'ID khong hop le'
            });
        }

        if (
            typeof pname !== 'string' ||
            !pname.trim() ||
            pname.length > 100 ||
            typeof price !== 'number' ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            return res.status(400).json({
                message: 'Du lieu san pham khong hop le'
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { pid }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: 'Khong tim thay san pham'
            });
        }

        const product = await prisma.product.update({
            where: { pid },
            data: {
                pname: pname.trim(),
                price,
                quantity
            }
        });

        return res.status(200).json({
            message: 'Cap nhat san pham thanh cong',
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi cap nhat san pham'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: 'ID khong hop le'
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { pid }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: 'Khong tim thay san pham'
            });
        }

        await prisma.product.delete({
            where: { pid }
        });

        return res.status(200).json({
            message: 'Xoa san pham thanh cong'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'P2003') {
            return res.status(409).json({
                message: 'San pham dang thuoc don hang, khong the xoa'
            });
        }

        return res.status(500).json({
            message: 'Loi khi xoa san pham'
        });
    }
};

module.exports = { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct };
