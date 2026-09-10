require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subcategoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/usage', require('./routes/usageRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

app.get('/', (req, res) => res.send('API running'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));