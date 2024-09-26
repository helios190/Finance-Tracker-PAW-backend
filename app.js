const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');  // Import cors
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all origins and methods
app.use(cors({ 
  origin: '*', 
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/income', require('./src/routes/incomeRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

const PORT = process.env.PORT || 5000; // Fallback port if PORT isn't defined in .env

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
