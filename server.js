const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routers
const loaiRoutes = require('./routes/loaiRoutes');
const menuRoutes = require('./routes/menuRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files (View layer)
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes (Router -> Controller -> Model mapping)
app.use('/api/loai', loaiRoutes);
app.use('/api/menu_dichvu', menuRoutes);
app.use('/api/dattiec', bookingRoutes);
app.use('/api/thanhtoan', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
