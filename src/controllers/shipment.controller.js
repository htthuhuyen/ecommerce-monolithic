
const prisma = require('../config/prisma');

const createShipment = async (req, res) => {
    try {
        const { oid, status } = req.body;

        if (
            !Number.isInteger(oid) ||
            oid <= 0 ||
            typeof status !== 'string' ||
            !status.trim() ||
            status.length > 50
        ) {
            return res.status(400).json({
                message: 'Du lieu giao hang khong hop le'
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                oid,
                uid: req.user.uid
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Khong tim thay don hang'
            });
        }

        const shipment = await prisma.shipment.create({
            data: {
                oid,
                status: status.trim()
            }
        });

        return res.status(201).json({
            message: 'Tao giao hang thanh cong',
            shipment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi tao giao hang'
        });
    }
};

const getAllShipments = async (req, res) => {
    try {
        const shipments = await prisma.shipment.findMany({
            where: {
                order: {
                    uid: req.user.uid
                }
            },
            orderBy: {
                shipid: 'desc'
            }
        });

        return res.status(200).json(shipments);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi lay danh sach giao hang'
        });
    }
};

const updateShipment = async (req, res) => {
    try {
        const shipid = Number(req.params.id);
        const { status } = req.body;

        if (
            !Number.isInteger(shipid) ||
            shipid <= 0 ||
            typeof status !== 'string' ||
            !status.trim() ||
            status.length > 50
        ) {
            return res.status(400).json({
                message: 'Du lieu khong hop le'
            });
        }

        const existing = await prisma.shipment.findFirst({
            where: {
                shipid,
                order: {
                    uid: req.user.uid
                }
            }
        });

        if (!existing) {
            return res.status(404).json({
                message: 'Khong tim thay giao hang'
            });
        }

        const shipment = await prisma.shipment.update({
            where: { shipid },
            data: {
                status: status.trim()
            }
        });

        return res.status(200).json({
            message: 'Cap nhat giao hang thanh cong',
            shipment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Loi khi cap nhat giao hang'
        });
    }
};

module.exports = {
    createShipment,
    getAllShipments,
    updateShipment
};
