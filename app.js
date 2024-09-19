const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/income', require('./src/routes/incomeRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
