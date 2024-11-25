const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, 
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/income', require('./src/routes/incomeRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/users', require('./src/routes/userRoutes')); 
app.use('/api/financial',require('./src/routes/financialRoutes'))

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
