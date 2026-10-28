const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const shipmentRoutes = require('./routes/shipment.routes');
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce Monolithic API is running'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
