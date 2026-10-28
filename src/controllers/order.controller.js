
const prisma = require('../config/prisma');

const createOrder = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Danh sach san pham khong hop le'
            });
        }

        const productIds = new Set();

        for (const item of items) {
            if (
                !item ||
                !Number.isInteger(item.pid) ||
                item.pid <= 0 ||
                !Number.isInteger(item.qty) ||
                item.qty <= 0 ||
                productIds.has(item.pid)
            ) {
                return res.status(400).json({
                    message: 'San pham hoac so luong khong hop le'
                });
            }

            productIds.add(item.pid);
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: { uid }
            });

            for (const item of items) {
                const updated = await tx.product.updateMany({
                    where: {
                        pid: item.pid,
                        quantity: { gte: item.qty }
                    },
                    data: {
                        quantity: { decrement: item.qty }
                    }
                });

                if (updated.count !== 1) {
                    throw new Error('PRODUCT_UNAVAILABLE');
                }

                const product = await tx.product.findUnique({
                    where: { pid: item.pid }
                });

                await tx.orderDetail.create({
                    data: {
                        oid: newOrder.oid,
                        pid: item.pid,
                        qty: item.qty,
                        unit_price: product.price
                    }
                });
            }

            // Tu dong tao Shipment khi dat hang thanh cong
            await tx.shipment.create({
                data: {
                    oid: newOrder.oid,
                    status: 'PENDING'
                }
            });

            // Lay thong tin Order, OrderDetail va Shipment
            return tx.order.findUnique({
                where: { oid: newOrder.oid },
                include: {
                    orderDetails: {
                        include: {
                            product: true
                        }
                    },
                    shipments: true
                }
            });
        });

        return res.status(201).json({
            message: 'Tao don hang thanh cong',
            order
        });

    } catch (error) {
        if (error.message === 'PRODUCT_UNAVAILABLE') {
            return res.status(400).json({
                message: 'San pham khong ton tai hoac khong du hang'
            });
        }

        console.error(error);

        return res.status(500).json({
            message: 'Loi khi tao don hang'
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const uid = req.user.uid;

        const orders = await prisma.order.findMany({
            where: { uid },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                },
                shipments: true
            },
            orderBy: {
                oid: 'desc'
            }
        });

        return res.status(200).json(orders);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Loi khi lay danh sach don hang'
        });
    }
};


const getOrderById = async (req, res) => {
    try {
        const oid = Number(req.params.id);
        const uid = req.user.uid;

        if (!Number.isInteger(oid) || oid <= 0) {
            return res.status(400).json({
                message: 'ID don hang khong hop le'
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                oid,
                uid
            },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                },
                shipments: true
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Khong tim thay don hang'
            });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Loi khi lay chi tiet don hang'
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById
};
